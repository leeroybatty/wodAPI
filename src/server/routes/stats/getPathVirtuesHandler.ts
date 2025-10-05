import { Response } from 'express';
import { prepareBaseOptions, getpathFromParams } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { referenceCache } from '../../sql';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse } from '../../errors';
import { 
  getpathPowers
} from './statsService';
import { isValidStatCategory } from './helpers';
import { AllStatCategoriesType, StatsFilters } from './types';

export const getPathVirtuesHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { path } = req.params; 
  if (path == null || path.trim() === "") {
    throw createErrorResponse(ErrorKeys.path_TYPE_NOT_FOUND);
  }
  let pathParam = path.toLowerCase();
  const isNumericId = !isNaN(Number(path)) && path.trim() !== '';
  if (isNumericId) {
    pathParam = referenceCache.getpathName(Number(path));
  }
  let options: StatsFilters = await prepareBaseOptions(req);
  try {
    const serviceResult = await getpathVirtues(pathParam, options);
    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}