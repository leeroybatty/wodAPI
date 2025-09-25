import { FilterOptions } from '../types';

export interface StatsFilters extends FilterOptions {
  monster?: string
}

export enum GeneralStatCategory {
  ARCHETYPES = 'archetype',
  ATTRIBUTES = 'attributes',
  PHYSICAL = 'physical',
  SOCIAL = 'social',
  MENTAL = 'mental',
  TALENTS = 'talents',
  SKILLS = 'skills',
  KNOWLEDGES = 'knowledges',
  ABILITIES = 'abilities',
  BACKGROUNDS = 'backgrounds',
  STATPOOL = 'statpool' // Willpower, and other spendable pools, e.g. Gnosis
}

export enum VampireStatCategory {
  DISCIPLINES = 'disciplines',
  VIRTUES = 'virtues',
  PATH = 'path' // humanity, etc.
}

export enum VampireStatPools {
  VITAE = 'vitae',
  BLOOD = 'blood',
  MAGE_BLOOD = 'mage blood',
  LUPINE_BLOOD = 'lupine blood'
}

export enum MageStatCategory {
  SPHERES = 'spheres',
  ARETE = 'arete'
}

export enum MageStatPools {
  QUINTESSENCE = 'quintessence',
  PARADOX = 'paradox',
  QUIET = 'quiet'
}

export enum WerewolfStatPools {
  RAGE = 'rage',
  GNOSIS = 'gnosis'
}

export enum WerewolfStatCategory {
  GIFTS = 'gifts',
  RENOWN = 'renown'
}

export const AllStatCategories = {
  ...GeneralStatCategory,
  ...VampireStatCategory,
  ...MageStatCategory,
  ...WerewolfStatCategory
} as const;

export type AllStatCategoriesType = typeof AllStatCategories[keyof typeof AllStatCategories];