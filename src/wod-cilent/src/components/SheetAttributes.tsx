import './statRating.js';
import './statColumn.js';
import './statSection.js';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useEffect, useState } from 'react';

function SheetAttributes() {
  const {sheet, updateStat, monsterName, templateName, updateValidity, stageList} = useCharacterSheet();
  const {physical, mental, social} = sheet.attributes;

  const [rankings, setRankings] = useState<number[]>([6,4,3]);
  const [totals, setTotals] = useState<number[]>([0,0,0]);

  useEffect(() => {
    const mortalTemplates = ['Human', 'Kinfolk', 'Sorcerer', 'Revenant', 'Ghoul'];
    if (mortalTemplates.includes(templateName)) {
      setRankings([6, 4, 3]);
    } else {
      setRankings([7, 5, 3]);
    }
  }, [setRankings, templateName]);

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
    const hasPrimary = newTotals.find((value) => value === rankings[0]);
    const hasSecondary = newTotals.find((value) => value === rankings[1]);
    const hasTertiary = newTotals.find((value) => value === rankings[2]);
    const isValid = !!hasPrimary && !!hasSecondary && !!hasTertiary;
    updateValidity({ attributes: isValid });
    setTotals(newTotals);

  }, [physical, social, mental, rankings, updateValidity])

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
          <p className={`sheet_helpertext ${stageList?.attributes && ' Hidden'}`}>
            Prioritize which Attribute categories are the most significant between Physical, Social, and Mental categories.
            Spend <strong className="Bold">{rankings[0]}</strong> dots on your highest priority, <strong className="Bold">{rankings[1]}</strong> for the second, and <strong className="Bold">{rankings[2]}</strong> for the least.
          </p>
  
    </div>
  )
}

export default SheetAttributes