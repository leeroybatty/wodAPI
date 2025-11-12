import { Response, Request } from 'express';
import { parseQueryParam, prepareBaseOptions } from '../../helpers';
import { ErrorKeys } from '../../../errors/errors.types';
import { ApiResponse } from '../../../apiResponse.types';
import { handleError, createErrorResponse, createSuccessResponse } from '../../../errors';
import { 
  getVampireRituals
} from '../statsService';
import { StatsFilters } from '../types';

export const getVampireRitualsHandler = async (req: Request, res: Response) => {
  const { path } = req.params;
  let options: StatsFilters = await prepareBaseOptions(req);
  
  const { levels } = req.query;
  const parsedLevels = parseQueryParam(levels);
  const numberedLevels = []

  for (let level of parsedLevels) {
    if (!isNaN(Number(level))) {
      numberedLevels.push(Number(level));
    }
  }

  try {
    const serviceResult = await getVampireRituals(path, {...options, levels: numberedLevels });
    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}