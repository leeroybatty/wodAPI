import './statRating.js';
import './statColumn.js';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';
import { useEffect, useState, useMemo, useRef } from 'react';
import { getStatSet } from '../services/api';

type StatDefinition = {
  id: number;
  name: string;
};

function SheetBackgrounds() {
  const { year, books } = useGame();
  const { sheet, organizationId, monsterName, updateStat } = useCharacterSheet();
  const { backgrounds } = sheet.advantages;
  const backgroundsDropdownRef = useRef<DropdownSelectElement>(null);
  
  const [backgroundDefs, setbackgroundDefs] = useState<StatDefinition[]>([]);
  
  const backgroundList = useMemo(() =>  backgroundDefs.sort((a, b) => a.name.localeCompare(b.name)),
    [backgroundDefs]
  );

  const selectedBackgrounds = useMemo(() => 
    backgroundList.filter(bg => backgrounds[bg.name]?.value > 0),
    [backgroundList, backgrounds]
  );

  useEffect(() => {
    const handleStatRemoved = (e: CustomEvent) => {
      const { subcategory, name } = e.detail;
      if (subcategory === 'backgrounds') {
        const dropdown = backgroundsDropdownRef.current;
        if (dropdown) {
          const bgDef = backgroundDefs.find(bg => bg.name.toLowerCase() === name.toLowerCase());
          if (bgDef) {
            dropdown.addOption({ id: bgDef.id, name: bgDef.name });
          }
        }
      }
    };

    const handleDropdownChanged = (e: CustomEvent) => {
      const { trait, id, name } = e.detail;
      console.log(trait)
      if (trait === 'backgrounds') {
        const dropdown = backgroundsDropdownRef.current;
        if (dropdown) {
          const option = dropdown.querySelector(`option[value="${id}"]`);
          if (option) option.remove();
          updateStat('advantages', 'backgrounds', name, { value: 1 });
        }
      }
    };

    document.addEventListener('stat-rating-removed', handleStatRemoved);
    document.addEventListener('dropdown-changed', handleDropdownChanged);
    
    return () => {
      document.removeEventListener('stat-rating-removed', handleStatRemoved);
      document.removeEventListener('dropdown-changed', handleDropdownChanged);
    };
  }, [backgroundDefs, updateStat, backgrounds]);

  const backgroundsTotal = useMemo(() => {
    return Object.values(backgrounds).reduce((sum, stat) => sum + stat.value, 0);
  }, [backgrounds]);

  useEffect(() => {
    const getBackgrounds = async () => {
      const options = { year, books };
      if (monsterName) {
        options.monster = monsterName;
      }
      if (organizationId) {
        options.faction = organizationId;
      }
      const backgroundsData = await getStatSet('backgrounds', options);
      setbackgroundDefs(backgroundsData);
      
      const availableBackgrounds = backgroundsData.filter(
        bg => !backgrounds[bg.name] || backgrounds[bg.name].value === 0
      );
      
      if (backgroundsDropdownRef.current) {
        backgroundsDropdownRef.current.setOptions(availableBackgrounds);
      }
    };  
    getBackgrounds();
  }, [year, books, monsterName, organizationId, backgrounds]);


  return (
    <stat-column name="backgrounds" floor={0} total={backgroundsTotal}>
      {selectedBackgrounds.map((stat) => (
        <stat-rating
          key={`background-${stat.id}`}
          data-id={stat.id}
          name={stat.name}
          subcategory="backgrounds"
          category="advantages"
          min={0}
          empty={!backgrounds[stat.name]?.value}
          removable={true}
          value={backgrounds[stat.name]?.value}
        />
      ))}
      <dropdown-select
        slot="dropdown"
        name="backgrounds" 
        label="Background"
        ref={backgroundsDropdownRef}
      />
    </stat-column> 
  );
}

export default SheetBackgrounds;