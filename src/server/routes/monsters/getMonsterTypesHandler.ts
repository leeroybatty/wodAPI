import { Response } from 'express';
import { resolveBookIds, validMonsters, Monster, parseQueryParam } from '../helpers';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { 
  getAllVampireClans,
  getAllRevenantFamilies,
  getAllGhoulClans,
  getAllShifterSpecies,
  getAllMageTraditions,
  getAllChangelingKiths,
  getAllDemonHouses,
  getAllHunterCreeds,
  getAllWraithTypes,
  getAllMummyTypes
} from './monsterService';

export const getMonsterTypesHandler = async (req: AuthenticatedRequest, res: Response) => {
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
        serviceResult = await getAllVampireClans(bookIds, icYear, exclusions);
        break;
      case 'revenant':
        serviceResult = await getAllRevenantFamilies(bookIds, icYear, exclusions);
        break;
      case 'ghoul':
        serviceResult = await getAllGhoulClans(bookIds, icYear, exclusions);
        break;
      case 'werewolf':
        serviceResult = await getAllShifterSpecies(bookIds, icYear, exclusions);
        break;
      case 'mage':
        serviceResult = await getAllMageTraditions(bookIds, icYear, exclusions);
        break;
      case 'changeling':
        serviceResult = await getAllChangelingKiths(bookIds, icYear, exclusions);
        break;
      case 'wraith':
        serviceResult = await getAllWraithTypes(bookIds, exclusions);
        break;
      case 'demon':
        serviceResult = await getAllDemonHouses(bookIds, icYear, exclusions);
        break;
      case 'hunter':
        serviceResult = await getAllHunterCreeds(bookIds, icYear, exclusions);
        break;
      case 'mummy':
        serviceResult = await getAllMummyTypes(bookIds, icYear, exclusions);
        break;
      default:
        const invalidParameterError = createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND)
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
