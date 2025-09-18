import { Response } from 'express';
import { resolveBookIds, validMonsters, Monster, parseQueryParam } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse } from '../../errors';
import { getVampireClans } from './monsterService';

export const getMonstersHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { monster } = req.params;
  const { books, year, exclude } = req.query;

  if (!validMonsters.has(monster as Monster)) {
    return res.status(400).json(
      createErrorResponse(ErrorKeys.INVALID_REQUEST)
    );
  };
  const monsterName = monster.toLowerCase();
  const icYear = year ? parseInt(year as string, 10) : 2025;

  const bookNames = parseQueryParam(books);
  const exclusions = parseQueryParam(exclude);

  try {
    let serviceResult: ApiResponse<unknown>;
    const { bookIds } = await resolveBookIds(bookNames);
    switch(monsterName) {
      case 'vampire':
        serviceResult = await getVampireClans(bookIds, icYear, exclusions);
        break;
      // case 'werewolf':
      //   serviceResult = await getShifterSpecies(bookIds, icYear, exclusions);
      //   break;
      // case 'mage':
      //   break;
      // case 'changeling':
      //   break;
      // case 'wraith':
      // case 'demon':
      //   break;
      //   break;
      // case 'hunter':
      //   break;
      // case 'mummy':
      //   break
      default:
        const invalidParameterError = createErrorResponse(ErrorKeys.INVALID_REQUEST)
        return res.status(404).json(invalidParameterError) ;
    }

    if (serviceResult.success) {
      return res.status(200).json(serviceResult);
    }
    const unknownError = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
    return res.status(500).json(unknownError);
  } catch (error) {
    handleError(error, req, res);
  }
}
