import { getStatDefinitions, getAffinityPowers, getVirtuesByPath, getRitualsByPath } from './statsRepository';
import { reconcileIncludeExclude } from '../helpers';
import { ApiResponse } from '../../apiResponse.types';
import { referenceCache } from '../../sql';
import { StatsFilters } from './types';
import { FilterOptions } from '../types';

export const getMonsterPowers = async (
  monster: string,
  options: FilterOptions
): Promise<ApiResponse<unknown>> => {
  const {bookIds, exclude, include, faction, format} = options;
  return await getAffinityPowers(monster, options);
}

export const getPathVirtues = async (
  path: string,
  options: FilterOptions
): Promise<ApiResponse<unknown>> => {
  return await getVirtuesByPath(path, options);
}

export const getVampireRituals = async (
  path: number | string,
  options: FilterOptions & { level?: number }
): Promise<ApiResponse<unknown>> => {

  let pathId: number;
  if (isNaN(Number(path)) && typeof path === 'string') {
    pathId = await referenceCache.getStatId(path);
  } else {
    pathId = Number(path);
  }

  return await getRitualsByPath(pathId as number, options);
}

export const getVampireMoralityPaths = async (
  options: StatsFilters
): Promise<ApiResponse<unknown>> => {
  const {year, include, exclude} = options;
  const icYear = year || 2025;
  let defaultExclusions = exclude ? [...exclude] : [];
  
  // whether or not you're including DA:V or just VTM core is
  // responsible for the lion's share of path exclusions here.
  
  if (icYear < 1750 ) {
    // These are more modern interpretations/variants of old roads
    // I'm 'phasing in' these ones at this arbitrary point.
    defaultExclusions.push(
      'path of metamorphosis',
      'path of lilith',
      'path of the feral heart',
      'path of typhon'
    );
  }

  if (icYear < 1666 ) {
    // these were invented specifically in 1666
    defaultExclusions.push(
      'path of death and the soul',
      'path of honorable accord',
      'path of caine',
      'path of cathari',
    );
    if (icYear < 1530) {
      // the first follower of PATIV was from 1530
      defaultExclusions.push('path of power and the inner voice');
      if (icYear < 500) {
        // originates from the Children of Judas who were ~500 AD
        defaultExclusions.push('path of ecstasy');
        if (icYear < -30) {
          // Originates from Roman Egypt which was ~30 BCE
          defaultExclusions.push('path of the warrior');
        }
      }
    }
  }

  const exclusions = include
    ? reconcileIncludeExclude(include, defaultExclusions)
    : defaultExclusions;

  return await getStatDefinitions(['path'], {
    ...options,
    exclude: exclusions
  })
}

export const getStatsInCategory = async (
  category: string,
  options: StatsFilters
): Promise<ApiResponse<unknown>> => {
  const {year, bookIds, exclude, include, monster, faction, format} = options;
  const icYear = year || 2025;
  let monsterName = monster || "";
  if (monster && !isNaN(Number(monster))) {
    monsterName = await referenceCache.getMonsterName(parseInt(monster));
  }

  if (category === 'path') {
    return getVampireMoralityPaths(options)
  }

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
      case faction && faction === 'technocracy':
        defaultExclusions = [...defaultExclusions, ...[
          'avatar',
          'arcane',
          'chantry',
          'dream',
          'familiar',
          'sanctum',
        ]];
        break;
      case faction && faction === 'traditions':
        defaultExclusions = [...defaultExclusions, ...[
          'genius',
          'cloaking',
          'construct',
          'hypercram',
          'companion',
          'requisitions',
          'laboratory',
          'secret weapons'
        ]];
        break;
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

    if (icYear < 1950) {
      defaultExclusions.push('technology');
      if (icYear < 1930) {
        defaultExclusions.push('drive');
        if (icYear < 1500) {
          defaultExclusions.push('firearms');
        }
      }
    }

    if (icYear > 1500) {
      defaultExclusions.push('commerce');
      if (icYear > 1900 ) {
        defaultExclusions.push('archery')
        if (icYear > 1930) {
          defaultExclusions.push('ride');
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
      monster: monsterName,
      faction,
      format
    }
  );
}