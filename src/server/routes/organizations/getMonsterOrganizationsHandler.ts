import { Response } from 'express';
import { prepareBaseOptions } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse } from '../../errors';
import { 
  getMonsterOrganizations
} from './organizationsService';
import { MonsterTemplates } from '../monsters/types';

export const getMonsterOrganizationsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { monster } = req.params;
  const { books, exclude, include, year, faction, format } = req.query;
  const options = await prepareBaseOptions(req);

  const isNumericId = !isNaN(Number(monster)) && monster.trim() !== '';
  
  if (!isNumericId) {
    const validMonsters = Object.values(MonsterTemplates);
    if (!validMonsters.includes(monster.toLowerCase() as MonsterTemplates)) {
      const invalidParameterError = createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND);
      return res.status(404).json(invalidParameterError);
    }
  }

  const monsterParam = isNumericId ? Number(monster) : monster.toLowerCase() as MonsterTemplates;

  try {
    const serviceResult = await getMonsterOrganizations(monsterParam, options);
    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}