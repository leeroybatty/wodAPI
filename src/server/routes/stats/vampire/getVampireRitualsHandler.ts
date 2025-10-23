import { Response } from 'express';
import { parseQueryParam, prepareBaseOptions } from '../../helpers';
import { AuthenticatedRequest } from '../../../middleware/auth';
import { ErrorKeys } from '../../../errors/errors.types';
import { ApiResponse } from '../../../apiResponse.types';
import { handleError, createErrorResponse, createSuccessResponse } from '../../../errors';
import { 
  getVampireRituals
} from '../statsService';
import { StatsFilters } from '../types';

export const getVampireRitualsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { path } = req.params;
  let options: StatsFilters = await prepareBaseOptions(req);
  
  const { level } = req.query;
  const isLevelNumeric = level && !isNaN(Number(level));

  if (level && !isLevelNumeric) {
    return res.status(400).json(createErrorResponse(ErrorKeys.INVALID_REQUEST));
  }
  const levelParam = Number(level);

  try {
    const serviceResult = await getVampireRituals(path, {...options, level: levelParam });
    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}