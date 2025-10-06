import './statRating.js';
import './statColumn.js';
import './statSection.js';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';
import { useEffect, useState, useMemo } from 'react';
import { getStatSet } from '../services/api';

type StatDefinition = {
  id: number;
  name: string;
};

function SheetAbilities() {
  const { year, books, houseRules } = useGame();
  const { sheet, templateName, stageList } = useCharacterSheet();
  const { talents, knowledges, skills } = sheet.abilities;
  
  const [talentDefs, setTalentDefs] = useState<StatDefinition[]>([]);
  const [skillDefs, setSkillDefs] = useState<StatDefinition[]>([]);
  const [knowledgeDefs, setKnowledgeDefs] = useState<StatDefinition[]>([]);

  const talentList = useMemo(() => 
    [...talentDefs].sort((a, b) => a.name.localeCompare(b.name)),
    [talentDefs]
  );

  const skillsList = useMemo(() => 
    [...skillDefs].sort((a, b) => a.name.localeCompare(b.name)),
    [skillDefs]
  );

  const knowledgesList = useMemo(() => 
    [...knowledgeDefs].sort((a, b) => a.name.localeCompare(b.name)),
    [knowledgeDefs]
  );

  const totals = useMemo(() => {
    const talentsTotal = Object.values(talents).reduce((sum, stat) => sum + stat.value, 0);
    const skillsTotal = Object.values(skills).reduce((sum, stat) => sum + stat.value, 0);
    const knowledgesTotal = Object.values(knowledges).reduce((sum, stat) => sum + stat.value, 0);
    return [talentsTotal, skillsTotal, knowledgesTotal];
  }, [talents, skills, knowledges]);

  useEffect(() => {
    const getAbilities = async () => {
      const [talents, skills, knowledges] = await Promise.all([
        getStatSet('talents', { year, books, monster: templateName, exclude: ['hobby talent'] }),
        getStatSet('skills', { year, books, monster: templateName, exclude: ['professional skill'] }),
        getStatSet('knowledges', { year, books, monster: templateName, exclude: ['expert knowledge'] })
      ]);

      setTalentDefs(talents);
      setSkillDefs(skills);
      setKnowledgeDefs(knowledges);
    };
    
    getAbilities();
  }, [year, books, templateName]);

  return (
    <div>
      <stat-section name="abilities" heading="Abilities">
        <stat-column name="Talents" floor={0} total={totals[0]}>
          {talentList.map((stat) => (
            <stat-rating
              key={`talent-${stat.id}`}
              ceiling={3}
              name={stat.name}
              subcategory="talents"
              category="abilities"
              min={0}
              value={talents[stat.name]?.value || 0}
            />
          ))}
          {houseRules?.singleCustomAbility && (
            <stat-rating
              ceiling={3}
              name="hobby talent"
              subcategory="talents"
              category="abilities"
              min="0"
              value={talents['hobby talent']?.value || 0}
            />
          )}
        </stat-column>

        <stat-column name="Skills" total={totals[1]}>
          {skillsList.map((stat) => (
            <stat-rating
              key={`skill-${stat.id}`}
              ceiling={3}
              name={stat.name}
              subcategory="skills"
              category="abilities"
              min={0}
              value={skills[stat.name]?.value || 0}
            />
          ))}
          {houseRules?.singleCustomAbility && (
            <stat-rating
              ceiling={3}
              name="expert skill"
              subcategory="skills"
              category="abilities"
              min="0"
              value={skills['expert skill']?.value || 0}
            />
          )}
        </stat-column>

        <stat-column name="Knowledges" total={totals[2]}>
          {knowledgesList.map((stat) => (
            <stat-rating
              key={`knowledge-${stat.id}`}
              ceiling={3}
              name={stat.name}
              subcategory="knowledges"
              category="abilities"
              min={0}
               value={knowledges[stat.name]?.value || 0}
            />
          ))}
          {houseRules?.singleCustomAbility && (
            <stat-rating
              ceiling={3}
              name="professional knowledge"
              subcategory="knowledges"
              category="abilities"
              min="0"
              value={knowledges['professional knowledge']?.value || 0}
            />
          )}
        </stat-column>
      </stat-section>
    </div>
  );
}

export default SheetAbilities;