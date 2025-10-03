  import { Response } from 'express';
  import { prepareBaseOptions, parseQueryParam,  getMonsterFromParams } from '../helpers';
  import { MonsterTemplates } from './types';
  import { AuthenticatedRequest } from '../../middleware/auth';
  import { ErrorKeys } from '../../errors/errors.types';
  import { ApiResponse } from '../../apiResponse.types';
  import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
  import { 
    getAllMonsterTypes
  } from './monsterService';

  export const getMonsterTypesHandler = async (req: AuthenticatedRequest, res: Response) => {
  const monsterParam = await getMonsterFromParams(req, true) as MonsterTemplates;

  try {
    const options = await prepareBaseOptions(req);
    const serviceResult = await getAllMonsterTypes(monsterParam, options);
    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
};