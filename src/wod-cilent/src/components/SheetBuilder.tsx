import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';
import { useEffect, useState, useMemo } from 'react';
import SheetHeader from './SheetHeader';
import SheetAttributes from './SheetAttributes';
import SheetAbilities from './SheetAbilities';
import SheetAdvantages from './SheetAdvantages';
function CharacterSheet() {

  const {updateStat, sheet, stageList, templateName, updateValidity} = useCharacterSheet();
  const { talents, skills, knowledges } = sheet.abilities;
  const { books, houseRules } = useGame();
  const { ghoulsAndRevenantsMastersFootsteps } = houseRules;
  const { physical, mental, social } = sheet.attributes;
  const { backgrounds, virtues } = sheet.advantages;

  useEffect(() => {
    const handleStatChange = (e: CustomEvent) => {
      const { name, value, element } = e.detail;
      const category = element.getAttribute('category');
      const subcategory = element.getAttribute('subcategory');
      updateStat(category, subcategory, name, { value });
      console.log(`I set ${category} ${subcategory} ${name} to ${value}.`)
    };
    document.addEventListener('stat-rating-changed', handleStatChange);
    return () => document.removeEventListener('stat-rating-changed', handleStatChange);
  }, [updateStat]);

  const splat = useMemo(() => {
    const splats = {
      'vampire': 'Vampire',
      'ghoul': 'Vampire',
      'revenant': 'Vampire',
      'human': 'Generic'
    }
    return splats[templateName] || 'Vampire'
  }, [templateName])

  /* START ATTRIBUTE RULES */
  const [attributeRankings, setAttributeRankings] = useState<number[]>([6, 4, 3]);
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
    const attributeTotals = [physicalTotal, socialTotal, mentalTotal]
    const hasPrimary = attributeTotals.includes(attributeRankings[0]);
    const hasSecondary = attributeTotals.includes(attributeRankings[1]);
    const hasTertiary = attributeTotals.includes(attributeRankings[2]);
    updateValidity({ attributes: hasPrimary && hasSecondary && hasTertiary });
  }, [physical, social, mental, attributeRankings, updateValidity])

   useEffect(() => {
    const mortalTemplates = ['human', 'kinfolk', 'sorcerer', 'revenant', 'ghoul'];
    setAttributeRankings(mortalTemplates.includes(templateName) ? [6, 4, 3] : [7, 5, 3]);
  }, [templateName]);

  /* END ATTRIBUTE RULES */

  /* START ABILITY RULES */
  const [abilityRankings, setAbilityRankings] = useState<number[]>([11, 7, 4]);
  const abilityTotals = useMemo(() => {
    const talentsTotal = Object.values(talents).reduce((sum, stat) => sum + stat.value, 0);
    const skillsTotal = Object.values(skills).reduce((sum, stat) => sum + stat.value, 0);
    const knowledgesTotal = Object.values(knowledges).reduce((sum, stat) => sum + stat.value, 0);
    return [talentsTotal, skillsTotal, knowledgesTotal];
  }, [talents, skills, knowledges]);

   useEffect(() => {
    const mortalTemplates = ['human', 'kinfolk', 'sorcerer', 'revenant', 'ghoul'];
    setAbilityRankings(mortalTemplates.includes(templateName) ? [11, 7, 4] : [13, 9, 5]);
  }, [templateName]);

  useEffect(() => {
    const hasPrimary = abilityTotals.includes(abilityRankings[0]);
    const hasSecondary = abilityTotals.includes(abilityRankings[1]);
    const hasTertiary = abilityTotals.includes(abilityRankings[2]);
    const isValid = hasPrimary && hasSecondary && hasTertiary;
    
    updateValidity({ abilities: isValid });
  }, [abilityTotals, abilityRankings, updateValidity]);
  /* END ABILITY RULES */

  /* BACKGROUNDS RULES */
  const backgroundsTotal = useMemo(() => {
    let total = 0;
    Object.values(backgrounds).forEach((stat) => {
      total += stat.value
    })
    return total
  }, [backgrounds]);

  useEffect(() => {
    const isValid = templateName === 'mage'
      ? backgroundsTotal === 7
      : backgroundsTotal === 5
    
    updateValidity({ backgrounds: isValid });
  }, [templateName, backgroundsTotal, updateValidity]);
  /* END BACKGROUNDS RULES */

  /* VAMPIRE STUFF */
  const showVirtues = useMemo(() => {
    if (['revenant', 'ghoul', 'vampire'].includes(templateName)) {
      return true
    }
    if (templateName === 'human' && !!books.join().match(/vampire/i)) {
      return true
    }
    return false
  }, [templateName, books]);

  const showDisciplines = useMemo(() => {
    return ['revenant', 'ghoul', 'vampire'].includes(templateName)
  }, [templateName])

  const activeVirtueNames = useMemo(() => {
    return Object.values(virtues).filter((virtue) => virtue.name !== 'courage' && virtue.value > 0 )
      .map((virtue) => virtue.name);
  }, [virtues])

  useEffect(() => {
    let total = 0;
    Object.values(virtues).forEach((virtue) => total += virtue.value )
    updateValidity({ virtues: total === 10})
  }, [virtues])
  /* END VAMPIRE STUFF*/

  return (
    <div className={`chargenner ${splat || 'Vampire'}BackgroundImage`}>
      <form className="sheet">
        <SheetHeader />
        <div className={`container ${stageList.template ? "Shown" : "Hidden"}`}>
          <SheetAttributes/>
        </div>

        <div className={`container ${stageList.attributes ? "Shown" : "Hidden"}`}>
          <SheetAbilities />
        </div>

        <div className={`container ${stageList.abilities ? "Shown" : "Hidden"}`}>
          <SheetAdvantages />
        </div>
      </form>
      
      <div>
        <ul className="chargen_instructions">
          <li>
            Pick your poison
            <p className={`SecondaryText ${stageList?.template ? ' Hidden' : 'Shown'}`}>
              Name your character, set your concept, and make your selection using the dropdowns.
            </p>
          </li>
          <li>
            Attributes
            <p className={`SecondaryText ${stageList?.attributes ? ' Hidden' : 'Shown'}`}>
              Prioritize which Attribute categories are the most significant between Physical, Social, and Mental categories.
              Spend <strong className="Bold">{attributeRankings[0]}</strong> dots on your highest priority,{' '}
              <strong className="Bold">{attributeRankings[1]}</strong> for the second, and{' '}
              <strong className="Bold">{attributeRankings[2]}</strong> for the least.
            </p>
          </li>
          <li>
            Abilities
            <p className={`SecondaryText ${stageList.abilities ? ' Hidden ': 'Shown'}`}>
              Prioritize which Ability categories are the most significant between Talents, Skills, and Knowledges.
              Spend <strong className="Bold">{abilityRankings[0]}</strong> dots on your highest priority,{' '}
              <strong className="Bold">{abilityRankings[1]}</strong> for the second, and{' '}
              <strong className="Bold">{abilityRankings[2]}</strong> for the least.
              You will be able to bring Abilities to scores of 4 and 5 with Freebie points.
            </p>
          </li>
          {showDisciplines && (
          <li>
            Disciplines
             <p className={`SecondaryText ${stageList.powers ? ' Hidden' : 'Shown' }`}>
              {templateName === 'vampire' 
                ? `Pick 3 dots of Disciplines.`
                : `Pick ${ghoulsAndRevenantsMastersFootsteps ? 2 : 1} Discipline dot${ghoulsAndRevenantsMastersFootsteps 
                  ?`s.`
                  : '. You get Potence 1 automatically'}. Ghouls and Revenants can only buy the 1st level of a Discipline by default. Lift this ceiling as high as 4 with the Domitor background. Domitor does not give Discipline points, but lifts the maximum.`
              }
              </p> 
          </li>)}
          <li>
            Backgrounds
            <p className={`SecondaryText ${stageList.backgrounds ? ' Hidden ': 'Shown'}`}>
              You have {templateName === 'mage' ? 7 : 5} dots to spend on Backgrounds.
            </p> 
          </li>
          {showVirtues && (
          <li>
            Virtues
            <p className={`SecondaryText ${stageList.virtues ? ' Hidden ': 'Shown'}`}>
              You have 7 dots to spend on Virtues. Your Courage rating determines your Willpower.
              {activeVirtueNames && ` Your Humanity/Path Rating is set by your ${activeVirtueNames[0] || 'Conscience'} and ${activeVirtueNames[1] ||  'Self Control'}.`}
            </p> 
          </li>)}


        </ul>
      </div>
    </div>
  )
}

export default CharacterSheet

