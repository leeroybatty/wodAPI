import '../statRating.js';
import '../statColumn.js';
import { useCharacterSheet } from '../../hooks/CharacterContext';
import { useGame } from '../../hooks/GameContext';
import { useEffect, useState, useMemo, useRef } from 'react';
import { getStatSet } from '../../services/api';

type StatDefinition = {
  id: number;
  name: string;
};

function SheetMagics({ bloodmagic, thaumaturgy }) {
  const { year, books } = useGame();
  const { sheet, organizationId, monsterName, updateStat, clearStatSet } = useCharacterSheet();
  const { magics, powers } = sheet.advantages;
  const magicsDropdownRef = useRef<DropdownSelectElement>(null);
  
  const [magicDefs, setmagicDefs] = useState<StatDefinition[]>([]);
  
  // all this does is just alphabetize the selection.
  const magicList = useMemo(() =>  magicDefs.sort((a, b) => a.name.localeCompare(b.name)),
    [magicDefs]
  );

  // when the available options or the user selection changes then what is selected is updated
  // for display purposes of rendering selectedMagics in a map function.
  const selectedMagics = useMemo(() => 
    magicList.filter(bm => magics[bm.name]?.value > 0),
    [magicList, magics]
  );

  useEffect(() => {
    const handleDropdownChanged = (e: CustomEvent) => {
      const { trait, name } = e.detail;
      if (trait === 'magics') {
        if (thaumaturgy) {
          clearStatSet('advantages', 'magics');
        }
        // When you select a magic it auto loads in at a rating of 1.
        const value = thaumaturgy ? powers[bloodmagic]?.value : 1 
        updateStat('advantages', 'magics', name, { value });
      }
    };
    document.addEventListener('dropdown-changed', handleDropdownChanged);
    
    return () => {
      document.removeEventListener('dropdown-changed', handleDropdownChanged);
    };
  }, [thaumaturgy, clearStatSet, powers, bloodmagic, updateStat]);

  // This totals ... how many dots you've spent on specific thaum paths.
  const magicsTotal = useMemo(() => {
    return Object.values(magics).reduce((sum, stat) => sum + stat.value, 0);
  }, [magics]);

  // this just determines the ceiling - each time you set your Thaumaturgy,
  // your path ratings fluctuate since they can't exceed Thaumaturgy.
  const ceiling = useMemo(() => {
    const stat = powers[bloodmagic]
    console.log(`ceiling object...`)
    console.log(stat?.value)
    return stat?.value
  }, [powers, bloodmagic]);

  // this effect determines what paths are available.
  useEffect(() => {
    if (!bloodmagic) return;
    const defaultPaths = {
      'thaumaturgy' : 'path of blood'
      // 'assamite sorcery':  none 
    }
    const getMagics = async () => {
      const options = { year, books };
      if (monsterName) options.monster = monsterName;
      if (organizationId) options.faction = organizationId;
      const magicsData = await getStatSet(bloodmagic, options);
      setmagicDefs(magicsData);
      if (magicsTotal === 0) {
        const defaultPath = defaultPaths[bloodmagic]
        if (defaultPath) {
          const value = thaumaturgy ? powers[bloodmagic]?.value : 1 
          updateStat('advantages', 'magics', defaultPath, { value })
        }
      }
    };  
    getMagics();
  }, [
    bloodmagic,
    updateStat,
    thaumaturgy,
    year,
    books,
    monsterName,
    organizationId,
    powers,
    getStatSet,
    setmagicDefs,
    magicsTotal
  ]);

  useEffect(() => {
    clearStatSet('advantages', 'magics');
  }, [monsterName])

  // this effect hides the options the user has already picked.
  useEffect(() => {
  if (!magicsDropdownRef.current || magicDefs.length === 0) return;
  const availableMagics = magicDefs.filter(
    bm => !magics[bm.name] || magics[bm.name].value === 0
  );
  magicsDropdownRef.current.setOptions(availableMagics);  
}, [magics, magicDefs, bloodmagic, magicsTotal]);

  return (
    <div>
      {selectedMagics.map((stat) => (
        <stat-rating
          key={`magic-${stat.id}`}
          data-id={stat.id}
          name={stat.name}
          displayName={stat.display}
          ceiling={ceiling}
          max={5}
          subcategory="magics"
          category="advantages"
          min={thaumaturgy ? 1 : 0}
          disabled={thaumaturgy}
          empty={!magics[stat.name]?.value}
          removable={bloodmagic !== 'thaumaturgy'}
          value={thaumaturgy ? powers[bloodmagic]?.value : magics[stat.name]?.value}
        />
      ))}
      <div className={`container ${!thaumaturgy && magicsTotal >= ceiling ? 'Hidden' : 'Shown'}`}>
        <dropdown-select
          slot="dropdown"
          name="magics" 
          label="Primary path"
          ref={magicsDropdownRef}
        />
      </div>
    </div> 
  );
}

export default SheetMagics;