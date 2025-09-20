import { AllStatCategories, AllStatCategoriesType } from './types'

export const AllStatCategoriesSet = new Set(Object.values(AllStatCategories));

export const isValidStatCategory = (value: string): boolean => {
  return AllStatCategoriesSet.has(value as AllStatCategoriesType);
};