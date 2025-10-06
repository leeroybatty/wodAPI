import { createContext, useContext, useCallback, useMemo, useState, ReactNode } from 'react';

type Stat = {
  name: string;
  displayName: string;
  value: number;
  max?: number;
  min?: number;
  ceiling?: number;
}

type StatColumn = Record<string, Stat>;

type Sheet = {
    attributes: {
      physical: StatColumn,
      mental: StatColumn,
      social: StatColumn
    },
    abilities: {
      talents: StatColumn,
      skills: StatColumn,
      knowledge: StatColumn
    },
    advantages: {
      backgrounds: StatColumn,
      disciplines: StatColumn
    }
};

type CharacterContextType = {
  monsterId: number | null;
  monsterName: string | null;
  organizationId: number | null;
  organizationName: string | null;
  templateId: number | null;
  templateName: string | null;
  setMonster: (id: number, name: string) => void;
  setOrganization: (id: number, name: string) => void;
  setTemplate: (id: number, name: string) => void;
  updateStat: (
    category: keyof CharacterContextType['sheet'],
    subcategory: string,
    statName: string,
    updates: Partial<Stat>
  ) => void;
  setStatColumn: (
    category: keyof CharacterContextType['sheet'],
    subcategory: string,
    stats: Array<{id: number, name: string}>,
    defaultValue?: number,
    ceiling?: number
  ) => void;
  sheet: Sheet;
  stageList: Record<string, boolean>
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);
CharacterContext.displayName = 'CharacterContext';

const stageListDefaults = {
  template: false,
  attributes: false,
  abilities: false,
  advantages: false,
  backgrounds: false,
  disciplines: false,
  virtues: false,
  path: false
};

const baseSheet = {
    personal: {
      archetypes: {
        nature: "",
        demeanor: ""
      },
      freeform: {
        concept: {},
        name: {}
      }
    },
    attributes: {
      physical: {
        strength: { value: 1 },
        dexterity: { value: 1 },
        stamina:{ value: 1 },
      },
      mental: {
        intelligence: { value: 1 },
        wits: { value: 1 },
        perception:{ value: 1 },
      },
      social: {
        appearance: { value: 1, ceiling: 5 },
        charisma: { value: 1 },
        manipulation:{ value: 1 },
      }
    },
    abilities: {
      talents: {},
      skills: {},
      knowledges: {}
    },
    advantages: {
      backgrounds: {},
      powers: {},
      virtues: {
        courage: { value: 1 },
        path: { name: 'humanity' }
      }
    },
    miscellaneous: {
      pools: {
        willpower: {},
      }
    }
};

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [monsterId, setMonsterId] = useState<number | null>(null);
  const [monsterName, setMonsterName] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [templateName, setTemplateName] = useState<string | null>(null);
  const [sheet, setSheet] = useState<sheet | null>(baseSheet)
  const [stageList, setStageList] = useState<Record<string, boolean>>(stageListDefaults);

  const updateStat = useCallback((
    category: keyof Sheet,
    subcategory: string,
    statName: string,
    updates: Partial<Stat>
  ) => {
    setSheet(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [statName]: {
            name: statName,
            displayName: statName,
            value: 0,
            ...(prev[category][subcategory][statName] || {}),
            ...updates
          }
        }
      }
    }));
  }, []);

  const updateValidity = useCallback((updates) => {
    setStageList(prev => ({
      ...prev,
      ...updates
    }))
  }, []);

  const setStatColumn = useCallback((
    category: keyof typeof sheet,
    subcategory: string,
    stats: Array<{id: number, name: string}>,
    defaultValue: number = 0,
    ceiling: number = 5
  ) => {
    const column: StatColumn = {};
    stats.forEach(stat => {
      column[stat.name.toLowerCase()] = {
        name: stat.name.toLowerCase(),
        displayName: stat.name,
        value: defaultValue,
        ceiling
      };
    });
    
    setSheet(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: column
      }
    }));
  }, []);

  const setTemplate = useCallback((id: number, name: string) => {
    setTemplateId(id);
    setTemplateName(name);
  }, []);

  const setMonster = useCallback((id: number, name: string) => {
    setMonsterId(id);
    setMonsterName(name);
  }, []);

  const setOrganization = useCallback((id: number, name: string) => {
    setOrganizationId(id);
    setOrganizationName(name);
  }, []);

  const value = useMemo(
    () => ({
      monsterId,
      monsterName,
      organizationId,
      organizationName,
      setMonster,
      setOrganization,
      setTemplate,
      templateId,
      templateName,
      updateStat,
      sheet,
      setStatColumn,
      stageList,
      updateValidity
    }),
    [
      monsterId,
      setMonster,
      setOrganization,
      setTemplate,
      templateId,
      templateName,
      monsterName,
      organizationId,
      organizationName,
      updateStat,
      sheet,
      setStatColumn,
      stageList,
      updateValidity
    ]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCharacterSheet() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within CharacterProvider');
  }
  return context;
}