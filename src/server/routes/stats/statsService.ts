import { getStatDefinitions, ValidFormat } from './statsRepository';
import { reconcileIncludeExclude } from '../helpers';
import { ApiResponse } from '../../apiResponse.types';
import { referenceCache } from '../../sql';

export const getStatsInCategory = async (
  category: string,
  options: {
    year: number,
    bookIds?: number[],
    exclude?: string[],
    include?: string[],
    monster?: string,
    faction?: string,
    format?: string
  }
): Promise<ApiResponse<unknown>> => {
  const {year, bookIds, exclude, include, monster, faction, format} = options;
  const monsterName = monster && monster.toLowerCase() || "";
 
  let fields = format && ["all", "names"].includes(format.toLowerCase()) 
    ? format.toLowerCase() as ValidFormat
    : "all";

  let categories = [category]
  if (category === 'attributes') {
    categories = ['social', 'mental', 'physical'];
  }
  if (category === 'abilities') {
    categories = ['talents', 'skills', 'knowledges'];
  }
  let defaultExclusions = exclude ? [...exclude] : [];
  let defaultInclusions = include ? [...include] : [];
  const bookSet = new Set(bookIds);

  if (categories.includes('backgrounds')) {

    const noAncestors = /^(silent\s+striders?|glass\s+walkers?|bone\s+gnawers?)$/i;
    const noPurebreed = /^(glass\s+walkers?|bone\s+gnawers?)$/i;
    const noResources = /^red\s+talons?$/i;

    switch (true) {
      case noPurebreed.test(monsterName):
        defaultExclusions.push('pure breed');
      case noAncestors.test(monsterName):
        defaultExclusions.push('ancestors')
        break;
      case noResources.test(monsterName):
        defaultExclusions.push('resources');
        break;
      default:
        break;
    }

    // Tal'Mahe'Ra members can have dots in Cult, and it's the
    // only stat that belongs to multiple factions.
    if (faction && ["true black hand", "tal'mahe'ra"].includes(faction.toLowerCase())) {
      defaultInclusions.push('cult')
    }
   
    if (bookIds) {
      const mageCore = await referenceCache.getBookId('mage: the ascension 20th anniversary core');
      const hunterCore = await referenceCache.getBookId('hunter: the reckoning');
      switch (true) {
        case bookSet.has(mageCore):
          defaultInclusions =  [...defaultInclusions, ...['totem', 'status']];
        case bookSet.has(hunterCore):
          defaultInclusions = [...defaultInclusions, ...['patron', 'destiny']];
          break;
        default:
          break;
      }  
    }
  }

  if (categories.includes('talents')) {
    if (year < 1700 ) {
      defaultInclusions.push('legerdemain');
    }
  }

  if (categories.includes('skills')) {

    if (bookIds) {
      // Meditation is accredited to Mage 20th, so at risk of being deleted if you want Wraith.
      const wraithCore = await referenceCache.getBookId('wraith: the oblivion 20th anniversary core');
      if (bookSet.has(wraithCore)) {
        defaultInclusions.push('meditation');
      }
    }
    switch (true) {
      case year < 1950:
        defaultExclusions.push('technology');
      case year < 1930:
        defaultInclusions.push('ride');
      case year < 1910:
        defaultExclusions.push('drive');
      case year < 1890:
        defaultInclusions.push('archery');
      case year < 1750:
        defaultInclusions.push('commerce');
      case year < 1500:
        defaultExclusions.push('firearms');
        break;
      default:
        break;
    }
  }

  if (categories.includes('knowledges')) {
    switch (true) {
    case year < 1980:
      defaultExclusions.push('computer');
    case year < 1914:
      defaultInclusions.push('seneschal');
    case year < 1700:
      defaultInclusions = [...defaultInclusions, ...['enigmas', 'theology', 'hearth wisdom']];
      break;
    default:
      break;
    }
  }

  const exclusions = include
    ? reconcileIncludeExclude(include, defaultExclusions)
    : defaultExclusions

  const inclusions = exclude
    ? reconcileIncludeExclude(exclude, defaultInclusions)
    : defaultInclusions

  return await getStatDefinitions(
    categories,
    {
      bookIds,
      exclude: exclusions,
      include: inclusions,
      monster,
      faction,
      fields
    }
  );
}