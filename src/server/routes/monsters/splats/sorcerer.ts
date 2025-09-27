type ActivityWindow = {
  from?: number;
  until?: number;
}

export type HistoricalPeriods = {
  name: string;
  aliases?: string[];
  active?: ActivityWindow[];
  alwaysExclude?: boolean;
}
export const SorcererOrganizationTimelines: HistoricalPeriods[] = [
  {
    name: 'the arcanum',
    active: [{ from: 1885 }]
  },
  {
    name: 'the cult of mercury',
    aliases: ['cultus mercurii','mercurists','cult of mercury'],
    active: [{ from: -200, until: 476 }]
  },
  {
    name: 'the ancient order of the aeon rites',
    active: [{ from: 1873 }]
  },
  {
    name: 'the society of enlightened altruistic ideologies',
    aliases: ['SEAI'],
    active: [{ from: 1870 }]
  },
  {
    name: 'the nephite priesthood', aliases: ['nephite priesthood'],
    active: [{ from: 1831, until: 2000}] // Mormon order probably shouldn't predate the Book of Morman, ykwim
  },
  {
    name: 'mogen halev',
    active: [{ from: 1825 }]
  },
  {
    name: 'the seven thunders', aliases: ['seven thunders'],
    active: [{ from: 1992, until: 2000 }]
  },
  {
    name: 'thal\'hun', aliases: ['star council of zoroaster','star council'],
    active: [{ from: 1961 }]
  },
  { name: 'project twilight',
    active: [{ from: 2000 }]
  },
  { 
    name: 'maison liban',
    active: [{ from: 1022 }]
  },
  {
    name: 'uzoma',
    active: [{ from: 1700 }]
  },
  {
    name: 'the silver portal',
    aliases: ['silver portal'],
    active: [{ from: 1700 }]
  },
  {
    name: 'forn jafnadr',
    active: [{ from: 800 }]
  },
  { 
    name: 'the fenian',
    active: [{ from: 300 }]
  },
  {
    name: 'the cult of isis',
    aliases: ['cult of isis'],
    active: [{ from: -2700 }]
  },
  { 
    name: 'the dozen priests of the pythian order',
    alwaysExclude: true
  },
  {
    name: 'balamo\'ob',
    aliases: ['balamob'],
    active: [{ from: 250 }]
  },
  {
    name: 'nebuu-afef',
    active: [{ from: -1279 }] // when Ramesses II's reign started
  }
];

