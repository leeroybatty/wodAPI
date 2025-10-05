import './statRating.js';
import './statColumn.js';
import SheetBackgrounds from './SheetBackgrounds';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';
import { useEffect, useState, useMemo } from 'react';
import { getPowers } from '../services/api';

type StatDefinition = {
  id: number;
  name: string;
};

function SheetDisciplines() {
  const { year, books, houseRules } = useGame();
  const { templateName, monsterName, sheet, updateValidity, updateStat, stageList } = useCharacterSheet();
  const { ghoulsAndRevenantsMastersFootsteps } = houseRules;
  const { powers } = sheet.advantages;

  const [powerDefs, setPowerDefs] = useState<StatDefinition[]>([]);

  // All Ghouls and Revenants start with 1 point of Potence, G&R 116.
  // Masters Footsteps HR changes it to be "Pick 2 of your sire's".
  const youAreGhoulAndYouGetPotence = useMemo(() => {
    return ghoulsAndRevenantsMastersFootsteps === false
      && ['Ghoul','Revenant'].includes(templateName);
   } , [ghoulsAndRevenantsMastersFootsteps, templateName]);

  const powersTotal = useMemo(() => {
    return Object.values(powers).reduce((sum, stat) => sum + stat.value, 0);
  }, [powers]);

  useEffect(() => {
    const fetchPowers = async () => {
      const options = { year, books };
      const powersData = await getPowers(monsterName, options);
      setPowerDefs(powersData);
    }
    fetchPowers();
  }, [year, youAreGhoulAndYouGetPotence, books, monsterName]);

  useEffect(() => {
    if (youAreGhoulAndYouGetPotence) {
      updateStat('advantages','powers','potence', { value: 1 });
    }
  }, [youAreGhoulAndYouGetPotence, updateStat])

  const powersList = useMemo(() =>  powerDefs.sort((a, b) => a.name.localeCompare(b.name)),
    [powerDefs]
  );

  useEffect(() => {
    if (templateName === 'Vampire') {
      console.log(powersTotal)
      updateValidity({ powers: powersTotal === 3 })
    } else {
      updateValidity({ powers: powersTotal === 2 })
    }
  }, [templateName, powersTotal]);
  
  return (
    <stat-column total={powersTotal || youAreGhoulAndYouGetPotence ? 1 : 0} name="disciplines">
      {powersList.map((stat) => (
        <stat-rating
          key={`power-${stat.id}`}
          data-id={stat.id}
          name={stat.name}
          category="advantages"
          subcategory="powers"
          min={0}
          ceiling={templateName === 'Vampire' ? 3 : 1}
          value={powers[stat.name]?.value || 0}
        />
      ))}
      {youAreGhoulAndYouGetPotence &&
        <stat-rating
          name="potence"
          category="advantages"
          subcategory="powers"
          min={1}
          ceiling={1}
          removable={false}
          value={1}
      />}
      
        <p className={`sheet_helpertext${stageList.powers ? ' Hidden' : '' }`}>
        {templateName === 'Vampire' 
          ? `Pick 3 dots of Disciplines.`
          : `Pick ${youAreGhoulAndYouGetPotence ? 1 : 2} Discipline dot${youAreGhoulAndYouGetPotence 
            ?`. You get Potence 1 automatically`
            : 's'}.`
        }
        </p>
    </stat-column>
  );
}

export default SheetDisciplines;