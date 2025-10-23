import { Response } from 'express';
import { parseQueryParam, prepareBaseOptions, getMonsterFromParams } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { 
  getMonsterPowers
} from './statsService';
import { isValidStatCategory } from './helpers';
import { AllStatCategoriesType, StatsFilters } from './types';

export const getPowersByMonsterHandler = async (req: AuthenticatedRequest, res: Response) => {
  const monsterParam = await getMonsterFromParams(req);
  let options: StatsFilters = await prepareBaseOptions(req);
  try {
    const serviceResult = await getMonsterPowers(monsterParam, {...options});
    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}