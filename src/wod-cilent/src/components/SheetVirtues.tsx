import './statRating.js';
import './statColumn.js';
import './statSection.js';
import SheetBackgrounds from './SheetBackgrounds';
import SheetDisciplines from './SheetDisciplines';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';
import { useEffect, useState, useMemo, useRef } from 'react';
import { getStatSet, getPathVirtues } from '../services/api';

type StatDefinition = {
  id: number;
  name: string;
};

function SheetVirtues() {
  const { year, books } = useGame();
  const { templateName, monsterName, sheet, updateValidity, updateStat, stageList, organizationId } = useCharacterSheet();
  const { virtues } = sheet.advantages;
  const pathsDropdownRef = useRef<DropdownSelectElement>(null);

  const [virtueDefs, setVirtueDefs] = useState<StatDefinition[]>([]);

  useEffect(() => {
    const getPaths = async () => {
      const options = { year, books, name: monsterName, faction: organizationId };
      const pathData = await getStatSet('path', options);
      if (pathsDropdownRef.current) {
        pathsDropdownRef.current.setOptions(pathData);
      }
    };  
    getPaths();
  }, [year, books, monsterName, organizationId]);

  useEffect(() => {
    const setPathVirtues = async () => {
      const newVirtues = await getPathVirtues(virtues.path.name)
      setVirtueDefs(newVirtues);
    }
    setPathVirtues()
  },
  [virtues.path.name])

  /* Revenants/Ghouls shouldn't be allowed to pick a Path of Enlightenment.
   * This prevents you from trying to make a vampire with a path, then changing
   * to ghoul/revenant to keep the path.
  */ 
  useEffect(() => {
    console.log("Setting path to humanity.")
    updateStat('advantages', 'virtues', 'path', { name: 'humanity' })
  }, [templateName, updateStat])

  useEffect(() => {
    if (virtueDefs && virtueDefs.length > 0) {
      const changingVirtues = ['conscience', 'self control', 'instinct', 'conviction'];
      const currentVirtues = new Set(virtueDefs.map((virtue) => virtue.name))
      for (const name of changingVirtues) {
        if (!currentVirtues.has(name)) {
          updateStat('advantages', 'virtues', name, { value: 0 });
        }
      }
    }
  }, [updateStat, virtueDefs]);

  useEffect(() => {  
    const handleDropdownChanged = (e: CustomEvent) => {
      const { trait, name } = e.detail;
      console.log(trait)
      if (trait === 'path') {
        updateStat('advantages', 'virtues', 'path', { name });
      }
    };
    document.addEventListener('dropdown-changed', handleDropdownChanged);
    return () => {
      document.removeEventListener('dropdown-changed', handleDropdownChanged);
    };
  }, [updateStat]);

  const virtuesTotal = useMemo(() => {
    return Object.values(virtues).reduce((sum, stat) => sum + stat.value, 0);
  }, [virtues]);

  useEffect(() => {
    const isValid = virtuesTotal === 7
    updateValidity({ virtues: isValid });
  }, [virtuesTotal, updateValidity])

  return (
    <stat-column total={virtuesTotal || 0} max={7} name="virtues" floor={-3} max={7}>
      {templateName === 'vampire' && <dropdown-select
        name="path" 
        label="Path"
        ref={pathsDropdownRef}
      />}
      {virtueDefs.map((stat) => (
        <stat-rating
          key={`virtue-${stat.id}`}
          data-id={stat.id}
          name={stat.name}
          subcategory="virtues"
          category="advantages"
          min={1}
          value={virtues[stat.name]?.value || 1}
        />
      ))}
      
    </stat-column>
  )
}

export default SheetVirtues;