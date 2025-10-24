import { Response } from 'express';
import { prepareBaseOptions, parseQueryParam } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { getAllTopLevelMonsters } from './monsterService';

export const getMonstersHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { splats } = req.query;
  const splatsParam = parseQueryParam(splats) || [];

  try {
    const options = await prepareBaseOptions(req);
    const serviceResult = await getAllTopLevelMonsters(splatsParam, options)

    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}
