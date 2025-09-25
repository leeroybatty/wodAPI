import { getStatDefinitions } from './statsRepository';
import { reconcileIncludeExclude } from '../helpers';
import { ApiResponse } from '../../apiResponse.types';
import { referenceCache } from '../../sql';
import { StatsFilters } from './types';

export const getStatsInCategory = async (
  category: string,
  options: StatsFilters
): Promise<ApiResponse<unknown>> => {
  const {year, bookIds, exclude, include, monster, faction, format} = options;
  const monsterName = monster && monster.toLowerCase() || "";
  const icYear = year || 2025;

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

  if (categories.includes('statpool')) {
    if (["ananasi", "nuwisha"].includes(monsterName)) {
      defaultExclusions.push('rage')
    }
  }

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
    if (icYear > 1700 ) {
      defaultExclusions.push('legerdemain');
    }
  }

  if (categories.includes('skills')) {
    if (bookIds) {
      const wraithCore = await referenceCache.getBookId('wraith: the oblivion 20th anniversary core');
      if (bookSet.has(wraithCore)) {
        defaultInclusions.push('meditation');
      }
    }

    if (icYear < 1500) {
      defaultExclusions.push('firearms', 'drive', 'technology');
      defaultInclusions.push('archery', 'commerce', 'ride');
    } else {
      defaultInclusions.push('firearms');
      if (icYear < 1750) {
        defaultInclusions.push('archery', 'commerce', 'ride');
        defaultExclusions.push('drive', 'technology');
      } else {
        defaultExclusions.push('commerce');
        if (icYear < 1890) {
          defaultInclusions.push('archery', 'ride');
          defaultExclusions.push('drive', 'technology');
        } else {
          defaultExclusions.push('archery');
          if (icYear < 1910) {
            defaultInclusions.push('ride');
            defaultExclusions.push('drive', 'technology');
          } else {
            defaultInclusions.push('drive');
            if (icYear < 1930) {
              defaultInclusions.push('ride');
              defaultExclusions.push('technology');
            } else {
              defaultExclusions.push('ride');
              if (icYear < 1950) {
                defaultExclusions.push('technology');
              } else {
                defaultInclusions.push('technology');
              }
            }
          }
        }
      }
    }
  }

  if (categories.includes('knowledges')) {
    if (icYear < 1700) {
      defaultInclusions.push('enigmas', 'theology', 'hearth wisdom', 'seneschal');
      defaultExclusions.push('computer');
    } else {
      defaultExclusions.push('enigmas', 'theology', 'hearth wisdom');
      if (icYear < 1914) {
        defaultInclusions.push('seneschal');
        defaultExclusions.push('computer');
      } else {
        defaultExclusions.push('seneschal');
        if (icYear < 1980) {
          defaultExclusions.push('computer');
        } else {
          defaultInclusions.push('computer');
        }
      }
    }
  }

  const exclusions = include
    ? reconcileIncludeExclude(include, defaultExclusions)
    : defaultExclusions;
  const inclusions = exclude
    ? reconcileIncludeExclude(exclude, defaultInclusions)
    : defaultInclusions;
  return await getStatDefinitions(
    categories,
    {
      bookIds,
      exclude: exclusions,
      include: inclusions,
      monster,
      faction,
      format
    }
  );
}