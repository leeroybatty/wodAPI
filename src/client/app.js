const vampireLabels =  ['Clan', 'Bloodline', 'Disciplines'];
const shifterLabels = ['Beast', 'Tribe', 'Gifts'];

const monsterTypeLabelMap = {
  'vampire': vampireLabels,
  'ghoul': vampireLabels,
  'revenant': ['Family', 'Bloodine', 'Disciplines'],
  'shifter': shifterLabels,
  'bastet': shifterLabels,
  'ratkin': shifterLabels,
  'kinfolk': shifterLabels,
  'mage': ['Tradition', '', 'Spheres'],
  'possessed': ['Type', 'N/A', 'Powers'],
};

const chargenner = window.SheetBuilder;

window.state = chargenner.state;
window.monsterTypeLabelMap = monsterTypeLabelMap;
window.updateMonsterMap = (entries) => chargenner.updateMonsterMap(entries);

const checkForSupernaturallyUgly = function () {
  const monsterName = chargenner.getMonsterName(chargenner.get('monsterType'));
  const isSupernaturallyUgly = [
    'nosferatu',
    'harbinger of skulls',
    'samedi'
  ].includes(monsterName);

  const appearance = document.querySelector('stat-rating[name="appearance"]');
  const currentValue = appearance.getValue();

  const newAppearanceRating = isSupernaturallyUgly ? 0 : Math.max(1, currentValue);
  const newCeiling = isSupernaturallyUgly ? 0 : 5;
  const newFloor = isSupernaturallyUgly ? -2 : -3;

  appearance.setAttribute('ceiling', newCeiling);
  appearance.setAttribute('value', newAppearanceRating);
  appearance.connectedCallback();

  const socialColumn = document.querySelector('stat-column[name="social"]');
  socialColumn.floor = newFloor;
  socialColumn.calculateTotal();
};

const loadTemplates = async function () {
  const templateDropdown = document.querySelector('dropdown-select[name="template"]');
  const books = chargenner.get('books');
  const response = await fetch(`/api/monsters?books=${books}`);
  const result = await response.json();
  
  chargenner.set('monsterTypes', result.data.monsters);
  chargenner.updateMonsterMap(result.data.monsters);
  
  templateDropdown.loadOptions(() => result.data.monsters);
};

const loadOrganizations = async function () {
  try {
    const monsterId = chargenner.get('monster');
    let monsterName = chargenner.getMonsterName(monsterId);
    
    if (['revenant', 'ghoul'].includes(monsterName)) {
      monsterName = 'vampire';
    }
    
    const books = chargenner.get('books');
    const year = chargenner.get('year');
    const organizations = await fetch(`/api/organizations/${monsterName}?books=${books}&year=${year}`);
    
    if (!organizations.ok) {
      throw new Error(`Response status: ${organizations.status}`);
    }
    
    const organizationsResult = await organizations.json();
    const { data } = organizationsResult;
    chargenner.set('organizations', data.organizations);
    chargenner.updateOrganizationMap(data.organizations);
    return data.organizations;
  } catch (error) {
    console.error(error.message);
  }
};


const loadMonsters = async function (monsterId) {
  try {
    const monsterName = chargenner.getMonsterName(monsterId);
    const organization = chargenner.get('organization');
    const books = chargenner.get('books');
    const exclude = chargenner.get('exclude');
    const year = chargenner.get('year');
    
    const options = await fetch(
      `/api/monsters/${monsterName}/type?faction=${organization}&books=${books}&exclude=${exclude[monsterName]}&year=${year}`
    );
    
    if (!options.ok) {
      if (options.status !== 404) {
        throw new Error(`Response status: ${options.status}`);
      }
      return [];
    }
    
    const optionsResult = await options.json();
    const { data } = optionsResult;
    
    chargenner.updateMonsterMap(data.monsters);
    return data.monsters;
  } catch (error) {
    console.error(error.message);
  }
};

const loadArchetypes = async function () {
  try {
    const books = chargenner.get('books');
    const archetypes = await fetch(`/api/stats/archetype?books=${books}`);
    
    if (!archetypes.ok) {
      throw new Error(`Response status: ${archetypes.status}`);
    }
    
    const result = await archetypes.json();
    const { data } = result;
    
    chargenner.set('archetypes', data.stats);
    return data.stats;
  } catch (error) {
    console.error(error.message);
  }
};

const loadBackgrounds = async function (monsterId = undefined) {
  let parameters = '';
  try {
    const books = chargenner.get('books');
    const organization = chargenner.get('organization');
    
    if (!!monsterId) {
      parameters += `&monster=${monsterId}&books=${books}`;
    }
    if (!!organization) {
      parameters += `&faction=${organization}`;
    }
    
    const backgrounds = await fetch(`/api/stats/backgrounds?${parameters}`);
    
    if (!backgrounds.ok) {
      throw new Error(`Response status: ${backgrounds.status}`);
    }
    
    const result = await backgrounds.json();
    const { data } = result;
    
    chargenner.update({
      backgrounds: data.stats,
      backgroundsMap: new Map(
        data.stats.map(row => [parseInt(row.id), row.name.toLowerCase()])
      )
    });
    
    const backgroundsColumn = document.querySelector('stat-column[name="backgrounds"]');
    backgroundsColumn.build(data.stats, true, true);
    backgroundsColumn.render();
    return data.stats;
  } catch (error) {
    console.error(error.message);
  }
};

const getStatSet = async function (category, params = '') {
  try {
    const year = chargenner.get('year');
    const statCategory = await fetch(
      `/api/stats/${category}?year=${year}${params ? `&${params}` : ''}`
    );
    
    if (!statCategory.ok) {
      throw new Error(`Response status: ${statCategory.status}`);
    }
    
    const statCategoryResult = await statCategory.json();
    const { data } = statCategoryResult;
    return data.stats;
  } catch (error) {
    console.error(error.message);
  }
};

const render = () => {
  const abilities = document.getElementById('abilities');
  const sheet = chargenner.get('sheet');
  
  for (let category in sheet.abilities) {
    const elementId = `abilities_${category}`;
    const column = document.getElementById(elementId);
    const statsArray = sheet.abilities[category];
    
    for (let stat of statsArray) {
      const statElement = document.createElement('stat-rating');
      statElement.setAttribute('name', stat.name);
      statElement.setAttribute('ceiling', 3);
      column.appendChild(statElement);
    }
  }

  const archetypes = chargenner.get('archetypes');
  const natureDropdown = document.querySelector('dropdown-select[name="nature"]');
  const demeanorDropdown = document.querySelector('dropdown-select[name="demeanor"]');
  natureDropdown.setOptions(archetypes);
  demeanorDropdown.setOptions(archetypes);
};

const setup = async function () {
  await loadTemplates();
  await loadArchetypes();
  
  const backgroundsDropdown = document.querySelector('dropdown-select[name="backgrounds"]');
  await backgroundsDropdown.loadOptions(() => loadBackgrounds());
  
  const sheet = chargenner.get('sheet');
  sheet.abilities.talents = await getStatSet('talents', 'exclude=Hobby Talent');
  sheet.abilities.skills = await getStatSet('skills', 'exclude=Professional Skill');
  sheet.abilities.knowledges = await getStatSet('knowledges', 'exclude=Expert Knowledge');
  
  render();
};

setup();


/*
* VAMPIRE STUFF
*/
const loadMoralityPaths = async function () {
  try {
    const monsterTypeId = chargenner.get('monsterType');
    const monsterName = chargenner.getMonsterName(monsterTypeId);
    const books = chargenner.get('books');
    const year = chargenner.get('year');
    
    const options = await fetch(`/api/stats/path?books=${books}&year=${year}&monster=${monsterName}`);
    
    if (!options.ok) {
      if (options.status !== 404) {
        throw new Error(`Response status: ${options.status}`);
      }
      return [];
    }
    
    const optionsResult = await options.json();
    const { data } = optionsResult;
    return data.stats;
  } catch (error) {
    console.error(error.message);
  }
};

const loadDisciplines = async function () {
  const monsterTypeId = chargenner.get('monsterType');
  if (!monsterTypeId) return;
  
  try {
    const disciplines = await fetch(`/api/stats/powers/${monsterTypeId}`);
    
    if (!disciplines.ok) {
      throw new Error(`Response status: ${disciplines.status}`);
    }
    
    const result = await disciplines.json();
    const { data } = result;
    const disciplinesColumn = document.querySelector('stat-column[name="disciplines"]');
    disciplinesColumn.build(data.stats, false);
  } catch (error) {
    console.error(error.message);
  }
};

const updateGeneration = () => {
  const year = chargenner.get('year');
  const generationBase = year < 1250 ? 12 : 13;
  const generationRating = document.querySelector(`stat-rating[name="generation"]`);
  const generation = generationBase - generationRating.getValue();
  const generationSpan = document.getElementById('vampire-generation');
  generationSpan.innerHTML = generation;
  let bloodpoolTotal = year < 1250 ? 11 : 10;
  if (generation === 7) {
    bloodpoolTotal = 20;
  } else {
    bloodpoolTotal += generationRating.getValue();
  }
  const bloodpoolRating = document.querySelector(`spendable-pool[name="bloodpool"]`);
  bloodpoolRating.setValue(bloodpoolTotal);
  bloodpoolRating.setAttribute('rating', bloodpoolTotal);
  bloodpoolRating.setMax(bloodpoolTotal);
};

const handleVampireStatDerivations = (e) => {
  const { name, value } = e.detail;
  if (name === 'generation') {
    updateGeneration();
  }
  if (name === 'courage') {
    const willpower = document.querySelector(`spendable-pool[name="willpower"]`);
    willpower.setValue(value);
    willpower.setAttribute('rating', value);
    willpower.render();
  }
  const pathVirtues = ['conscience', 'conviction', 'self-control', 'instinct'];
  if (pathVirtues.includes(name)) {
    let pathTotal = 0;
    for (let virtue of pathVirtues) {
      const stat = document.querySelector(`stat-rating[name="${virtue}"]`);
      pathTotal += stat.getValue();
    }
    const pathRating = document.querySelector(`stat-rating[name="path"]`);
    pathRating.setValue(pathTotal);
  }
}

document.addEventListener('category-stat-rating-removed', (e) => {
  const { category, name, id } = e.detail;
  const dropdownToAppend = document.querySelector(`dropdown-select[name="${category}"]`);
  dropdownToAppend.addOption({ id, name });
});

const ghoulRevenantSheetSelectors = [
  'stat-column[name="disciplines"]',
  'stat-column[name="virtues"]',
];

const vampireSheetSelectors = [
    'spendable-pool[name="bloodpool"]',
    'div[id="path-of-enlightenment"]',
    'div[id="generation-indicator"]'
  ];

const removeVampireSpecificStuff = function () {
  for (let selector of [...vampireSheetSelectors, ...ghoulRevenantSheetSelectors]) {
     document.querySelector(selector).classList.add('Hidden');
  }
  document.removeEventListener('stat-rating-changed', handleVampireStatDerivations);
  checkForSupernaturallyUgly();
}

const removeSplatSpecificStuff = function() {
  document.querySelector('dropdown-select[name="monster_subtype"]')
    .removeAttribute('required')

    console.log("Requirement removed.")
  removeVampireSpecificStuff();
}

const addGhoulRevenantStuff = async function() {
  for (let selector of [...vampireSheetSelectors, ...ghoulRevenantSheetSelectors]) {
    document.querySelector(selector).classList.remove('Hidden');
  }
  document.addEventListener('stat-rating-changed', handleVampireStatDerivations);
}

const addVampireStuff = async function () {
  updateGeneration();
  const moralityDropdown = document.querySelector('dropdown-select[name="morality"]');
  await moralityDropdown.loadOptions(() => loadMoralityPaths());
}

const checkForBloodlineRestrictions = function () {
  const orgName = chargenner.getOrgName(chargenner.get('organization'));
  const monsterName = chargenner.getMonsterName(chargenner.get('monsterType'));
  if (orgName === 'tal\'mahe\'ra' && monsterName === 'ventrue') {
    document.querySelector('dropdown-select[name="monster_subtype"]')
    .setAttribute('required', 'true');
  }
}

const setMonsterType = async function() {
  const backgroundsDropdown = document.querySelector('dropdown-select[name="backgrounds"]');
  const subtypeDropdown = document.querySelector('dropdown-select[name="monster_subtype"]');
  await subtypeDropdown.loadOptions(() => loadMonsters(chargenner.get('monsterType')));
  await backgroundsDropdown.loadOptions(() => loadBackgrounds(chargenner.get('monsterType')));
  const template = chargenner.get('template');
  switch (true) {
    case template === 'vampire':
      checkForSupernaturallyUgly();
      checkForBloodlineRestrictions();
    case ['ghoul','revenant'].includes('template'):
      await loadDisciplines();
      break;
    default:
      break;
  }
}

document.addEventListener('dropdown-changed', async (e) => {
  const { name, value } = e.detail;
  const backgroundsDropdown = document.querySelector('dropdown-select[name="backgrounds"]');
  
  switch (name) {
    case 'template':
      chargenner.set('monster', parseInt(value));
      removeSplatSpecificStuff();
      const orgDropdown = document.querySelector('dropdown-select[name="organization"]');
      await orgDropdown.loadOptions(() => loadOrganizations());
      await backgroundsDropdown.loadOptions(() => loadBackgrounds(chargenner.get('monster')));
      const template = chargenner.getMonsterName(parseInt(value)).toLowerCase();
      chargenner.set('template', template);
      switch (true) {
        case template === 'vampire':
          addVampireStuff();
        case template === 'ghoul' || template === 'revenant':
          addGhoulRevenantStuff();
          break;
        default:
          break;
      }
      break;

    case 'organization':
      chargenner.set('organization', parseInt(value));
      const typeDropdown = document.querySelector('dropdown-select[name="monster_type"]');
      await typeDropdown.loadOptions(() => loadMonsters(chargenner.get('monster')));
      await loadBackgrounds();
      break;

    case 'monster_type':
      chargenner.set('monsterType', parseInt(value));
      setMonsterType();
      break;

    case 'monster_subtype':
      if (value === 'pending') {
        const monster = document.querySelector('dropdown-select[name="monster_type"]').getValue();
        chargenner.set('monsterType',  monster)
        setMonsterType();
        return;
      }
      chargenner.set('monsterType', value);
      break;
  }
})