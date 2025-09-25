  import { Response } from 'express';
  import { prepareBaseOptions, parseQueryParam } from '../helpers';
  import { MonsterTemplates } from './types';
  import { AuthenticatedRequest } from '../../middleware/auth';
  import { ErrorKeys } from '../../errors/errors.types';
  import { ApiResponse } from '../../apiResponse.types';
  import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
  import { 
    getAllMonsterTypes
  } from './monsterService';

  export const getMonsterTypesHandler = async (req: AuthenticatedRequest, res: Response) => {
    const { monster } = req.params;
    const { books, year, exclude } = req.query;

    const validMonsters = Object.values(MonsterTemplates)
    if (!validMonsters.includes(monster.toLowerCase() as MonsterTemplates)) {
      const invalidParameterError = createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND)
      return res.status(404).json(invalidParameterError) ;
    };
    const monsterType = monster.toLowerCase() as MonsterTemplates;

    try {
      const options = await prepareBaseOptions(req);
      const serviceResult = await getAllMonsterTypes(monsterType, options)

      if (serviceResult.success) {
        return res.status(200).json(serviceResult);
      }
      const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
      return res.status(500).json(unknownError);
    } catch (error) {
      handleError(error, req, res);
    }
  }
