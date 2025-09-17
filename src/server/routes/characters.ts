import { Request, Response } from 'express';
import { queryDbConnection, getOneRowResult, withTransaction } from '../sql';
import { AuthenticatedRequest } from '../middleware/auth';
import { handleError, ValidationError, QueryExecutionError } from '../errors';
import { ApiSuccessResponse } from '../apiResponse.types'

export async function getCharacterStat(req: AuthenticatedRequest, res: Response) {
  try {
    const { id, statName } = req.params;
    
    const query = `
      SELECT bcs.value 
      FROM bridge_characters_stats bcs 
      JOIN stats ON stats.id = bcs.stat_id 
      JOIN characters ON characters.id = bcs.character_id 
      WHERE characters.id = $1 
        AND LOWER(stats.name) LIKE LOWER($2)
      LIMIT 1
    `;

    const result = await queryDbConnection(query, [id, `${statName}%`]);
    const statData = getOneRowResult(result);

    const successResponse: ApiSuccessResponse<{value: number, character: string, stat: string}> = {
      success: true,
      data: {
        value: statData?.value || 0,
        character: id,
        stat: statName
      }
    };
    
    res.json(successResponse);

  } catch (error) {
    handleError(error, req, res);
  }
}

export async function setCharacterStat(req: AuthenticatedRequest, res: Response) {
  try {
    const { id, statName } = req.params;
    const { value: rawValue, disamb } = req.body;

    const value = parseInt(rawValue, 10);
    if (isNaN(value) || !Number.isInteger(value)) {
      return res.status(400).json({ error: 'Value must be a valid integer' });
    }
    
    if (!Number.isInteger(value)) {
      return res.status(400).json({ error: 'Value must be an integer' });
    }

    await withTransaction(async (client) => {
      const statResult = await queryDbConnection(
        'SELECT id FROM stats WHERE LOWER(name) LIKE LOWER($1) LIMIT 1',
        [`${statName}%`],
        client
      );

      const statData = getOneRowResult(statResult);
      if (!statData) {
        throw new ValidationError(`Stat not found: ${statName}`, '', []);
      }

      const charResult = await queryDbConnection(
        'SELECT id FROM characters WHERE id = $1',
        [id],
        client
      );

      const charData = getOneRowResult(charResult);
      if (!charData) {
        throw new ValidationError(`Character not found: ${id}`, '', []);
      }

      if (value === 0) {
        await queryDbConnection(
          'DELETE FROM bridge_characters_stats WHERE stat_id = $1 AND character_id = $2',
          [statData.id, charData.id],
          client
        );
      } else {
        await queryDbConnection(`
          INSERT INTO bridge_characters_stats (character_id, stat_id, value, disamb) 
          VALUES ($1, $2, $3, $4) 
          ON CONFLICT (character_id, stat_id, disamb) 
          DO UPDATE SET value = $3
        `, [charData.id, statData.id, value, disamb || ''], client);
      }
    });

    res.json({ 
      success: true,
      data: {
        character: id,
       stat: statName,
       value: value === 0 ? null : value
      }
    });

  } catch (error) {
    handleError(error, req, res);
  }
}