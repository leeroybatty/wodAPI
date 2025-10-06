import './statRating.js';
import './statColumn.js';
import './statSection.js';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useEffect, useState } from 'react';

function SheetAttributes() {
  const {sheet, updateStat, monsterName, templateName, stageList} = useCharacterSheet();
  const {physical, mental, social} = sheet.attributes;

  const [totals, setTotals] = useState<number[]>([0,0,0]);

  useEffect(() => {
    if (monsterName) {
      const monster = monsterName.toLowerCase();
      const supernaturallyUgly = [
        'nosferatu',
        'samedi',
        'harbinger of skulls'
      ];
      if (supernaturallyUgly.includes(monster)) {
        updateStat('attributes', 'social', 'appearance', { ceiling: 0, min: 0, value: 0 });
      } else {
        updateStat('attributes', 'social', 'appearance', { ceiling: 5, min: 1, value: 1 })
      }
    }
  }, [monsterName, updateStat]);

  useEffect(() => {
    let physicalTotal = -3;
    let socialTotal = -3;
    let mentalTotal = -3;
    Object.values(physical).forEach((stat) => {
      physicalTotal += stat.value;
    })
    Object.values(social).forEach((stat) => {
      socialTotal += stat.value;
    })
    Object.values(mental).forEach((stat) => {
      mentalTotal += stat.value;
    })
    const newTotals = [physicalTotal, socialTotal, mentalTotal]
    setTotals(newTotals);
  }, [physical, social, mental])

  return (
    <div>
      <stat-section name="attributes" heading={`Attributes`} empty={stageList?.template}>
        <stat-column name="physical" floor={-3} total={totals[0]}>
          <stat-rating
            name="strength"
            subcategory="physical"
            category="attributes"
            min="1"
            value={physical.strength.value}
          />
          <stat-rating
            name="dexterity"
            subcategory="physical"
            category="attributes"
            min="1"
            value={physical.dexterity.value}
          />
          <stat-rating
            name="stamina"
            subcategory="physical"
            category="attributes"
            min="1"
            value={physical.stamina.value}
          />
        </stat-column>

        <stat-column name="Social" floor={-3} total={totals[1]}>
          <stat-rating
              name="charisma"
              subcategory="social"
              category="attributes"
              min="1"
              value={social.charisma.value}
            />
            <stat-rating
              name="manipulation"
              subcategory="social"
              category="attributes"
              min="1"
              value={social.manipulation.value}
            />
            <stat-rating
              name="appearance"
              subcategory="social"
              category="attributes"
              min={social.appearance.min || 1 }
              ceiling={social.appearance.ceiling}
              value={social.appearance.value}
            />
        </stat-column>

        <stat-column name="Mental" floor={-3} total={totals[2]}>
          <stat-rating
            name="intelligence"
            subcategory="mental"
            category="attributes"
            min="1"
            value={mental.intelligence.value}
          />
          <stat-rating
            name="wits"
            subcategory="mental"
            category="attributes"
            min="1"
            value={mental.wits.value}
          />
          <stat-rating
            name="perception"
            subcategory="mental"
            category="attributes"
            min="1"
            value={mental.perception.value}
          />
        </stat-column>
      </stat-section>
    </div>
  )
}

export default SheetAttributes