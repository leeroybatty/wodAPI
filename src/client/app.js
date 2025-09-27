const monsterTypeLabelMap = {
  'vampire': ['Clan', 'Bloodline'],
  'ghoul': ['Clan'],
  'revenant': ['Family'],
  'kinfolk': ['Beast', 'Tribe'],
  'mage': ['Tradition'],
  'possessed': ['Type'],
  'shifter': ['Beast', 'Tribe'],
  'bastet': ['Beast', 'Tribe'],
  'ratkin': ['Beast', 'Aspect']
};

const state = {
  year: 2025,
  books: [
  'vampire: the masquerade 20th anniversary core',
  'vampire: dark ages 20th anniversary core',
  'lore of the bloodlines'
  ],
  exclude: {
    vampire: ['baali']
  },
  monsterTypes: [],
  monsterMap: new Map(),
  sheet: {
    attributes: {
      physical: [],
      mental: [],
      social: []
    },
    abilities: {
      talents: [],
      skills: [],
      knowledges: []
    }
  }
};

const updateMonsterMap = function (newEntries) {
  const newMonsterMap = new Map(
    newEntries.map(row => [row.id, row.name.toLowerCase()])
  );
  state.monsterMap = new Map([...state.monsterMap, ...newMonsterMap]);
}

window.state = state;
window.monsterTypeLabelMap = monsterTypeLabelMap;
window.updateMonsterMap = updateMonsterMap;

const buildOptions = function (elementId, options) {

  const addOption = function(option) {
    const newOption = document.createElement('option');
    newOption.value = option.id;
    newOption.text = option.name;
    dropdownSelect.appendChild(newOption)
  }

  const dropdownSelect = document.getElementById(elementId);
  const dropdownContainer = document.getElementById(elementId.replace('dropdown','field'))
  dropdownSelect.innerHTML = '';
  dropdownContainer.classList.remove('Disabled');
  dropdownContainer.classList.remove('Hidden');
  
  if (options.length === 1) {
    dropdownContainer.classList.add('Disabled');
    addOption(options[0]);
  }

  if (options.length === 0) {
    dropdownContainer.classList.add('Hidden');
  }

  if (options.length > 1) {
    console.log("many options")
    const unselected = document.createElement('option');
    unselected.value = null;
    unselected.text = "Select...";
    unselected.selected = true;
    unselected.disabled = true;
    dropdownSelect.appendChild(unselected);
    for (let option of options) {
      addOption(option)
    }
  }
}



const updateCeilings = function (monster) {
  const monsterName = state.monsterMap.get(monster);
  const isSupernaturallyUgly = [
    'nosferatu',
    'harbinger of skulls',
    'samedi'
    ].includes(monsterName)

  const appearance = document.getElementById('stat-appearance');
  const newAppearance = document.createElement('stat-rating');
  newAppearance.setAttribute('name','appearance');
  const checkedAppearance = document.querySelector('input[name="appearance"]:checked');
  let oldRating = 0;
  if (checkedAppearance) {
    oldRating = checkedAppearance.value
  }
  const newAppearanceRating = isSupernaturallyUgly ? 0 : Math.max(1, oldRating);
  const newCeiling = isSupernaturallyUgly ? 0 : 5;
  newAppearance.setAttribute('ceiling', newCeiling);
  newAppearance.setAttribute('value', newAppearanceRating );
  appearance.replaceWith(newAppearance);
  state.attributes.social.appearance = newAppearanceRating;
}

const loadTemplates = async function () {
  const templateDropdown = document.querySelector('dropdown-select[name="template"]');
  const response = await fetch(`/api/monsters?books=${state.books}`);
  const result = await response.json();
  state.monsterTypes = result.data.monsters;
  updateMonsterMap(state.monsterTypes);
  templateDropdown.loadOptions(() => result.data.monsters);
}

const loadOrganizations = async function () {
  try {
    const organizations = await fetch(`/api/organizations/${state.monster}?books=${state.books}`);
    if (!organizations.ok) {
      throw new Error(`Response status: ${organizations.status}`);
    }
    const organizationsResult = await organizations.json();
    const { data } = organizationsResult;
    state.organizations = data.organizations;
    return state.organizations;
  } catch (error) {
    console.error(error.message);
  } 
}

const loadMonsters = async function (monster) {
  try {
    const monsterName = state.monsterMap.get(monster)
    const options = await fetch(`/api/monsters/${monsterName}/type?faction=${state.organization}&books=${state.books}&exclude=${state.exclude[monsterName]}`);
    if (!options.ok) {
      if (options.status !== 404) {
        throw new Error(`Response status: ${options.status}`);
      }
      return [];
    }
    const optionsResult = await options.json();
    const { data } = optionsResult;
    updateMonsterMap(data.monsters);
    return data.monsters
  } catch (error) {
    console.error(error.message);
  }
}


const getStatSet = async function (category, params = '') {
  try {
    const statCategory = await fetch(`/api/stats/${category}?year=${state.year}${params ? `&${params}` : ''}`);
    if (!statCategory.ok) {
      throw new Error(`Response status: ${statCategory.status}`);
    }
    const statCategoryResult = await statCategory.json();
    const { data } = statCategoryResult;
    return data.stats
  } catch (error) {
    console.error(error.message);
  }
}

const render = () => {
  const abilities = document.getElementById('abilities');
  for(let category in state.sheet.abilities) {
    const elementId = `abilities_${category}`;
    const column = document.getElementById(elementId)
    const statsArray = state.sheet.abilities[category];
    for(let stat of statsArray) {
      const statElement = document.createElement('stat-rating');
      statElement.setAttribute('name', stat.name);
      statElement.setAttribute('ceiling', 3);
      column.appendChild(statElement);
    }  
  }
}

const setup = async function () {
  loadTemplates();
  state.sheet.abilities.talents = await getStatSet('talents', 'exclude=Hobby Talent');
  state.sheet.abilities.skills = await getStatSet('skills', 'exclude=Professional Skill');
  state.sheet.abilities.knowledges = await getStatSet('knowledges', 'exclude=Expert Knowledge');
  render();
}

setup();

document.addEventListener('DOMContentLoaded', async function() {
  await loadTemplates();
    document.addEventListener('dropdown-changed', async (e) => {
    const { name, value, element } = e.detail;
    
    switch (name) {
      case 'template':
        state.monster = parseInt(value);
        const orgDropdown = document.querySelector('dropdown-select[name="organization"]');
        await orgDropdown.loadOptions(() => loadOrganizations());
        break;
        
      case 'organization':
        state.organization = parseInt(value);
        const typeDropdown = document.querySelector('dropdown-select[name="monster_type"]');
        await typeDropdown.loadOptions(() => loadMonsters(state.monster));
        break;
        
      case 'monster_type':
        state.monsterType = value;
        const subtypeDropdown = document.querySelector('dropdown-select[name="monster_subtype"]');
        await subtypeDropdown.loadOptions(() => loadMonsters(state.monsterType));
        updateCeilings(state.monsterType);
        break;
    }
  });
});