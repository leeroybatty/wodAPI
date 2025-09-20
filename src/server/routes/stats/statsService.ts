import { getStatDefinitions } from './statsRepository'
import { reconcileIncludeExclude } from '../helpers'
import { ApiResponse } from '../../apiResponse.types';

export const getStatsInCategory = async (
  category: string,
  options: {
    year: number,
    bookIds?: number[],
    exclude?: string[],
    include?: string[]
  }
): Promise<ApiResponse<unknown>> => {
  const {year, bookIds, exclude, include} = options;

  let categories = [category]
  if (category === 'attributes') {
    categories = ['social', 'mental', 'physical'];
  }
  if (category === 'abilities') {
    categories = ['talents', 'skills', 'knowledges'];
  }
  let defaultExclusions = exclude ? [...exclude] : [];
  let defaultInclusions = include ? [...include] : [];

  if (categories.includes('talents')) {
    if (year < 1700 ) {
      defaultInclusions.push('legerdemain');
    }
  }

  if (categories.includes('skills')) {
    if (year < 1950) {
      defaultExclusions.push('technology');
      if (year < 1930) {
        defaultInclusions.push('ride');
        if (year < 1910) {
          defaultExclusions.push('drive');
          if (year < 1890) {
            defaultInclusions.push('archery');
            if (year < 1750 ) {
              defaultInclusions.push('commerce');
              if (year < 1500) {
                defaultExclusions.push('firearms');
              }
            }
          }
        }
      }
    }
  }

  if (categories.includes('knowledges')) {
    if (year < 1980) {
      defaultExclusions.push('computer');
      if (year < 1914) {
        defaultInclusions.push('seneschal');
        if (year < 1700) {
          defaultInclusions = [...defaultInclusions, ...['enigmas', 'theology', 'hearth wisdom']];
        }
      }
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
    bookIds,
    exclusions,
    inclusions
  );
}