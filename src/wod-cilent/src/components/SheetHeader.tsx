import { useEffect, useRef, useMemo, useCallback } from 'react';
import './dropdownSelect';
import './statSection';
import {
  getTemplates,
  getArchetypes,
  getOrganizations,
  getMonsters
} from '../services/api';
import { useCharacterSheet } from '../hooks/CharacterContext';
import { useGame } from '../hooks/GameContext';

function SheetHeader() {
  const templateRef = useRef<DropdownSelectElement>(null);
  const natureRef = useRef<DropdownSelectElement>(null);
  const demeanorRef = useRef<DropdownSelectElement>(null);
  const organizationRef = useRef<DropdownSelectElement>(null);
  const monsterTypeRef = useRef<DropdownSelectElement>(null);
  const monsterSubtypeRef = useRef<DropdownSelectElement>(null);

  const { sheet, setTemplate, setMonster, monsterName, setOrganization, organizationId, templateName, updateStat, updateValidity, stageList } = useCharacterSheet();
  const { year, books } = useGame();

  useEffect(() => {
    const setup = async () => {
      const natureSelect = natureRef.current;
      const demeanorSelect = demeanorRef.current;
      const templateSelect = templateRef.current;
      try {
        const templates = await getTemplates({books});
        const archetypes = await getArchetypes();
        if (templateSelect) {
          templateSelect.setOptions(templates);
        }
        if (natureSelect && demeanorSelect) {
          natureSelect.setOptions(archetypes);
          demeanorSelect.setOptions(archetypes);
        }
      }
      catch (error) {
        console.error(error);
      }
    };
    setup();
  }, [books]);

  useEffect(() => {
    const { nature, demeanor } = sheet.personal.archetypes;
    const { name, concept } = sheet.personal.freeform;

    const baseRequirementsMet = !!nature.value && !!demeanor.value && !!name.value && !!concept.value;
    if (baseRequirementsMet) {
      switch (true) {
        case templateName === 'human':
          updateValidity({template: true })
          break;
        default:
          updateValidity({template :
            !!organizationId && !!monsterName})
          break;
      }
    } 
  }, [templateName, monsterName, updateValidity, organizationId, sheet.personal])

  useEffect(() => {
    const loadOrganizations = async () => {
      const template = ['revenant','ghoul'].includes(templateName)
        ? 'vampire'
        : templateName;

      const exclude = templateName === 'revenant'
        ? ['anarchs','autarkis']
        : [];

      try {
        const organizations = await getOrganizations(template, {year, books, exclude});
        if (organizationRef.current) {
          organizationRef.current.setOptions(organizations);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadOrganizations();
    monsterTypeRef.current.hide();
    monsterSubtypeRef.current.hide();
  }, [templateName, year, books])

  const handleTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name, value } = target
    const subcategory = target.getAttribute('subcategory')
    const category = target.getAttribute('category')
    updateStat(category, subcategory, name, {value})
  };

  const handleDropdownSelection = useCallback(async (e: CustomEvent) => {
    const {name, id} = e.detail
    const monsterType = monsterTypeRef.current;
    const monsterSubtype = monsterSubtypeRef.current;

    const monsterTypeLabels = {
      'vampire': 'Clan',
      'ghoul': 'Clan',
      'revenant': 'Family',
      'mage': 'Craft',
      'shifter': 'Beast',
      'possessed': 'Type',
      'kinfolk': 'Beast',
      'changeling': 'Kith',
    };

    const monsterSubtypeLabels = {
      'vampire': 'Bloodline',
      'shifter': 'Tribe',
      'kinfolk': 'Tribe',
    };

    switch (e.detail.trait) {
      case 'nature':
        updateStat('personal', 'archetypes', 'nature', { value: name });
        break;
      case 'demeanor':
        updateStat('personal', 'archetypes', 'demeanor', {value: name });
        break;
      case 'template':
        setTemplate(id, name);
        break;
      case 'organization':
        monsterSubtype.hide();
        setOrganization(id, name);
        if (monsterType) {
          monsterType.setAttribute('label', monsterTypeLabels[templateName] || 'Type');
          const monsters = await getMonsters(templateName, {faction: id, year });
          monsterType.setOptions(monsters);
        }
        if (monsterSubtype) {
          monsterSubtype.setAttribute('label', monsterSubtypeLabels[templateName] || 'Subtype');
        }
        break;
      case 'monster_type':
        if (monsterSubtype) {
          monsterSubtype.hide();
          setMonster(id, name)
          const subMonsters = await getMonsters(name, {faction: organizationId });
          monsterSubtype.setOptions(subMonsters);
        }
        break;
      default:
        break;
    }
  },
  [
    monsterTypeRef,
    monsterSubtypeRef,
    setOrganization,
    organizationId,
    year,
    setTemplate,
    templateName,
    setMonster,
    updateStat
  ]);

  const factionLabel = useMemo(() => {
    return ["ghoul","revenant"].includes(templateName)
      ? "Domitor Faction"
      : "Faction"
  }, [templateName])

  useEffect(() => {
    document.addEventListener('dropdown-changed', handleDropdownSelection);
    return () => document.removeEventListener('dropdown-changed', handleDropdownSelection);
  }, [handleDropdownSelection]);

  return (
    <stat-section name="character" displayname="Your Character">
      <div className="sheet_column">
        <div className="form_field">
          <label className="form_label" htmlFor="character_name">Name</label>
          <input
            className="form_control"
            id="character_name"
            type="text"
            name="name"
            category="personal"
            subcategory="freeform"
            onChange={handleTextInput}
          />
        </div>
        
        <dropdown-select 
          name="template"
          label="Splat"
          ref={templateRef}
          required="true"
        />
        
        <dropdown-select 
          name="organization" 
          label={factionLabel || "Faction"}
          empty="true"
          ref={organizationRef}
          required="true"
        />
      </div>

      <div className="sheet_column">
        <dropdown-select
          name="nature"
          label="Nature"
          category="personal"
          subcategory="archetypes"
          required="true"
          ref={natureRef}
        />

        <dropdown-select
          name="demeanor"
          label="Demeanor"
          category="personal"
          subcategory="archetypes"
          required="true"
          ref={demeanorRef}
        />
        
        <div className="form_field">
          <label className="form_label" htmlFor ="character_concept">Concept</label>
          <input
            className="form_control"
            id="character_concept"
            type="text"
            name="concept"
            category="personal"
            subcategory="freeform"
            onChange={handleTextInput}
          />
        </div>
      </div>

      <div className="sheet_column">
        <dropdown-select 
          name="monster_type" 
          label="Monster Type"
          empty="true"
          required="true"
          ref={monsterTypeRef}
        />

        <dropdown-select 
          name="monster_subtype" 
          label="Monster Subtype"
          empty="true"
          ref={monsterSubtypeRef}
        />

        <div className={`sheet_trait-entry${monsterName !== 'vampire' ? ' Hidden' : ''}`}>
            <span className="sheet_stat-name">Generation</span>
            <span id="vampire-generation">13</span>
        </div>
      </div>
   </stat-section> 
  );
}

export default SheetHeader;