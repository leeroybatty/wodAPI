import './statRating.js';
import './statColumn.js';
import './statSection.js';
import SheetBackgrounds from './SheetBackgrounds';
import SheetDisciplines from './SheetDisciplines';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';
import { useEffect, useState, useMemo } from 'react';
import { getPowers } from '../services/api';

type StatDefinition = {
  id: number;
  name: string;
};

function SheetAdvantages() {
  const { year, books, houseRules } = useGame();
  const { templateName, monsterName, sheet, updateValidity, updateStat } = useCharacterSheet();
  const { virtues } = sheet.advantages;

  const [virtueDefs, setVirtueDefs] = useState<StatDefinition[]>([]);

  const isVTM = useMemo(() => {
    return ['Revenant', 'Ghoul', 'Vampire'].includes(templateName)
  }, [templateName]);
  
  return (
    <div>
      <stat-section name="advantages" heading="Advantages">
        {isVTM && <SheetDisciplines />}
        <SheetBackgrounds />
        {isVTM &&
          (
            <stat-column name="virtues" floor={-3} max={7}>
              <stat-rating
                name="conscience"
                display-name="Conscience"
                min="1"
                value={virtues['conscience']?.value || 1}
                category="advantages"
                subcategory="virtues"
              />
              <stat-rating
                name="self-control"
                display-name="Self-Control"
                min="1"
               value={virtues['self-control']?.value || 1}
                category="advantages"
                subcategory="virtues"
              />
              <stat-rating
                name="Courage"
                display-name="Courage"
                min="1"
                value={virtues['courage']?.value || 1}
                category="advantages"
                subcategory="virtues"
              />
            </stat-column>
          )
        }
      </stat-section>
    </div>
  )
}

export default SheetAdvantages;