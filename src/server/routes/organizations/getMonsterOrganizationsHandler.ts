import { Response, Request } from 'express';
import { prepareBaseOptions, getMonsterFromParams } from '../helpers';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse } from '../../errors';
import { 
  getMonsterOrganizations
} from './organizationsService';
import { MonsterTemplates } from '../monsters/types';

export const getMonsterOrganizationsHandler = async (req: Request, res: Response) => {
  const options = await prepareBaseOptions(req);

  const monsterParam = await getMonsterFromParams(req, true) as MonsterTemplates;

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