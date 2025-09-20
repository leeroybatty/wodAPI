import { Response } from 'express';
import { resolveBookIds, parseQueryParam } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { 
  getStatsInCategory
} from './statsService';
import { isValidStatCategory } from './helpers';
import { AllStatCategoriesType } from './types';

export const getStatsByTypeHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const { books, exclude, include, year } = req.query;

  if (!isValidStatCategory(type as AllStatCategoriesType)) {
    return res.status(404).json(
      createErrorResponse(ErrorKeys.STAT_TYPE_NOT_FOUND)
    );
  };

  const icYear = year ? parseInt(year as string, 10) : 2025;

  const category = type.toLowerCase();
  
  const bookNames = parseQueryParam(books);
  const exclusions = parseQueryParam(exclude);
  const inclusions = parseQueryParam(include);

  try {
    const { bookIds } = await resolveBookIds(bookNames);
    const serviceResult = await getStatsInCategory(category, {
      year: icYear,
      bookIds,
      include: inclusions,
      exclude: exclusions
    });

    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}