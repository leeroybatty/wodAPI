import './statRating.js';
import './statColumn.js';
import './spendablePool.js';
import './statSection.js';
import SheetBackgrounds from './SheetBackgrounds';
import SheetDisciplines from './SheetDisciplines';
import SheetVirtues from './SheetVirtues';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';
import { useMemo, useEffect } from 'react';

function SheetAdvantages() {
  const { templateName, sheet, updateStat} = useCharacterSheet();
  const { books, year } = useGame();
  const { virtues, backgrounds } = sheet.advantages;

  const isHumanWithVTMSphere = useMemo(() => {
    const hasVampire = !!books.join().match(/vampire/i);
    const isHuman = templateName === 'human'
    return hasVampire && isHuman
  }, [templateName, books]);

  const isVTM = useMemo(() => {
    return ['revenant', 'ghoul', 'vampire'].includes(templateName)
  }, [templateName]);

  const willpowerTotal = useMemo(() => {
    if (isVTM || isHumanWithVTMSphere) {
      return virtues.courage.value || 1
    }
    return 1
  }, [isVTM, isHumanWithVTMSphere, virtues])

  const pathTotal = useMemo(() => {
    let total = 0;
    const pathVirtues = ['conscience', 'conviction', 'self control', 'instinct'];
    pathVirtues.forEach((virtue) => {
      total += virtues[virtue]?.value
    });
    return total
  }, [virtues]);

  const bloodpoolTotal = useMemo(() => {
    const baseBloodpool = year < 1250 ? 11 : 10;
    let bump = backgrounds.generation?.value || 0;
    if (bump === 5 && baseBloodpool === 11) {
      bump = 9
    }
    return baseBloodpool + bump
  }, [backgrounds?.generation?.value, year])

  return (
    <div>
      <stat-section name="advantages" heading="Advantages">
        {isVTM && <SheetDisciplines />}
        <SheetBackgrounds />
        {(isHumanWithVTMSphere || isVTM) && <SheetVirtues />}
      </stat-section>

      <stat-section name="miscellaneous" heading="Miscellaneous">
         {isVTM && (
          <div class="sheet_column">
            <stat-rating max={10} name={virtues.path.name || 'Humanity'} min={1} value={pathTotal} disabled={true} ceiling={10}></stat-rating>
          </div>
        )}
        <div class="sheet_column">
          <spendable-pool
            name="willpower"
            value={willpowerTotal}
            max={10}
            rating={willpowerTotal}
          />
        </div>
        {isVTM && (
          <div class="sheet_column">
            <spendable-pool name="bloodpool" rating={bloodpoolTotal} />
          </div>
        )}
      </stat-section>
    </div>
  )
}

export default SheetAdvantages;