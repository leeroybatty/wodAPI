import { Response } from 'express';
import { parseQueryParam, prepareBaseOptions } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { 
  getStatsInCategory
} from './statsService';
import { isValidStatCategory } from './helpers';
import { AllStatCategoriesType, StatsFilters } from './types';

export const getStatsByTypeHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const { monster } = req.query;

  if (!isValidStatCategory(type as AllStatCategoriesType)) {
    return res.status(404).json(
      createErrorResponse(ErrorKeys.STAT_TYPE_NOT_FOUND)
    );
  };
  const category = type.toLowerCase();
  let options: StatsFilters = await prepareBaseOptions(req);
  let monsterParam = parseQueryParam(monster).pop();

  try {
    const serviceResult = await getStatsInCategory(category, {...options, monster: monsterParam});
    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}