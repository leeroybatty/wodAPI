import '../statRating.js';
import '../statColumn.js';
import { useCharacterSheet } from '../../hooks/CharacterContext';
import { useGame } from '../../hooks/GameContext';
import { useEffect, useState, useMemo } from 'react';
import { getPowers } from '../../services/api';
import SheetMagics from './SheetBloodMagic';

type StatDefinition = {
  id: number;
  name: string;
};

function SheetDisciplines() {
  const { year, books, houseRules } = useGame();
  const { templateName, monsterName, sheet, updateValidity, updateStat } = useCharacterSheet();
  const { ghoulsAndRevenantsMastersFootsteps } = houseRules;
  const { powers } = sheet.advantages;

  const [powerDefs, setPowerDefs] = useState<StatDefinition[]>([]);

  // All Ghouls and Revenants start with 1 point of Potence, G&R 116.
  // Masters Footsteps HR changes it to be "Pick 2 of your sire's".
  const youAreGhoulAndYouGetPotence = useMemo(() => {
    return ghoulsAndRevenantsMastersFootsteps === false
      && ['ghoul','revenant'].includes(templateName);
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
  }, [year, books, monsterName]);

  useEffect(() => {
    if (powerDefs && powerDefs.length > 0) {
      const stalePowers = Object.values(powers).map((power) => power.name );
      const currentPowers = new Set(powerDefs.map((virtue) => virtue.name))
      for (const name of stalePowers) {
        if (!currentPowers.has(name)) {
          updateStat('advantages', 'powers', name, { value: 0 });
        }
      }
    }
  // 'powers' intentionally omitted to prevent infinite loop
  }, [updateStat, powerDefs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (youAreGhoulAndYouGetPotence) {
      updateStat('advantages','powers','potence', { value: 1 });
    }
  }, [youAreGhoulAndYouGetPotence, updateStat])

  const powersList = useMemo(() =>  powerDefs.sort((a, b) => a.name.localeCompare(b.name)),
    [powerDefs]
  );

  useEffect(() => {
    if (templateName === 'vampire') {
      updateValidity({ powers: powersTotal === 3 })
    } else {
      updateValidity({ powers: powersTotal === 2 })
    }
  }, [templateName, powersTotal, updateValidity]);

  const bloodMagics = useMemo(() => {
    const magicalDisciplines = [
      "thaumaturgy",
      "assamite sorcery",
      "tremere",
      "wanga",
      "akhu",
      "koldunic sorcery",
      "necromancy"
    ];
    return magicalDisciplines.filter((bm) => powers[bm]?.value > 0);
  }, [powers])
  
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
          ceiling={templateName === 'vampire' ? 3 : 1}
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
      {bloodMagics && bloodMagics.map((pathName) => {
        return (<SheetMagics
          bloodmagic={pathName}
          thaumaturgy={pathName != 'necromancy'}
        />)
      })}
    </stat-column>
  );
}

export default SheetDisciplines;