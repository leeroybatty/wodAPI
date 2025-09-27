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

const buildOptions = function (elementId, options) {
  const dropdownSelect = document.getElementById(elementId);
  const dropdownContainer = document.getElementById(elementId.replace('dropdown','field'))
  if (options.length > 0) {
    dropdownSelect.innerHTML = '';
    const unselected = document.createElement('option');
    unselected.value = null;
    unselected.text = "Select...";
    unselected.selected = true;
    unselected.disabled = true;
    dropdownSelect.appendChild(unselected);
    for (let option of options) {
      const newOption = document.createElement('option');
      newOption.value = option.id;
      newOption.text = option.name;
      dropdownSelect.appendChild(newOption)
    }
    dropdownContainer.classList.remove('Hidden');
  } else {
    dropdownContainer.classList.add('Hidden');
  }
}

const updateCeilings = function (monster) {
  const monsterName = state.monsterMap.get(monster);
  const appearance = document.getElementById('stat-appearance');
  const newAppearance = document.createElement('stat-rating');
  newAppearance.setAttribute('name','appearance');
  const checkedAppearance = document.querySelector('input[name="appearance"]:checked');
  let oldRating = 0;
  if (checkedAppearance) {
    oldRating = checkedAppearance.value
  }
  const newAppearanceRating = monsterName === 'nosferatu' ? 0 : Math.max(1, oldRating);
  const newCeiling = monsterName === 'nosferatu' ? 0 : 5;
  newAppearance.setAttribute('ceiling', newCeiling);
  newAppearance.setAttribute('value', newAppearanceRating );
  appearance.replaceWith(newAppearance);
  state.attributes.social.appearance = newAppearanceRating;
}

const updateMonsterMap = function (newEntries) {
  const newMonsterMap = new Map(
    newEntries.map(row => [row.id, row.name.toLowerCase()])
  );
  state.monsterMap = new Map([...state.monsterMap, ...newMonsterMap]);
}

const loadTemplates = async function () {
  try {
    const templates = await fetch(`/api/monsters?books=${state.books}`);
    if (!templates.ok) {
      throw new Error(`Response status: ${templates.status}`);
    }
    const templatesResult = await templates.json();
    const { data } = templatesResult;
    state.monsterTypes = data.monsters;
    updateMonsterMap(data.monsters);
    buildOptions('template_dropdown', state.monsterTypes);
  } catch (error) {
    console.error(error.message);
  }
}

const loadOrganizations = async function () {
  const template = state.monsterMap.get(state.monster)
  const organizationsSection = document.getElementById('sheet_organization');
  try {
    const organizations = await fetch(`/api/organizations/${state.monster}?books=${state.books}`);
    if (!organizations.ok) {
      throw new Error(`Response status: ${organizations.status}`);
    }
    const organizationsResult = await organizations.json();
    const { data } = organizationsResult;
    state.organizations = data.organizations;
    buildOptions('organization_dropdown', state.organizations);
  } catch (error) {
    console.error(error.message);
  } 
}

const getMonsters = async function (monster) {
  try {
    const monsterName = state.monsterMap.get(monster)
    const options = await fetch(`/api/monsters/${monsterName}/type?faction=${state.organization}&books=${state.books}&exclude=${state.exclude[monsterName]}`);
    if (!options.ok) {
      if (options.status !== 404) {
        throw new Error(`Response status: ${options.status}`);
      }
      console.log("returning blank")
      return [];
    }
    const optionsResult = await options.json();
    const { data } = optionsResult;
    return data.monsters
  } catch (error) {
    console.error(error.message);
  }
}

const loadMonsterTypes = async function () {
  const selection = await getMonsters(state.monster);
  const monsterTypeDropdown = document.getElementById('monster_type_dropdown');
  if (selection.length > 0) {
    updateMonsterMap(selection);
    buildOptions('monster_type_dropdown', selection);
  }
}

const loadMonsterSubtypes = async function () {
  const selection = await getMonsters(state.monsterType);
  const monsterSubtypeDropdown = document.getElementById('monster_subtype_dropdown');
  if (selection.length > 0) {
    updateMonsterMap(selection);
    buildOptions('monster_subtype_dropdown', selection);
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
    const templateDropdown = document.getElementById('template_dropdown');
    templateDropdown.addEventListener('change', async function() {
      state.monster = parseInt(templateDropdown.value);
      loadOrganizations();
      buildOptions('monster_type_dropdown', []);
      const monsterTypeLabel = document.getElementById('monster_type_dropdown_label');
      const monsterSubtypeLabel = document.getElementById('monster_subtype_dropdown_label');
      const labelNames = monsterTypeLabelMap[state.monsterMap.get(state.monster)];
      monsterTypeLabel.innerHTML = labelNames[0];
      monsterSubtypeLabel.innerHTML = labelNames[1] || "Type";
    });

    const organizationDropdown = document.getElementById('organization_dropdown');
    organizationDropdown.addEventListener('change', async () => {
      state.organization = organizationDropdown.value;
      loadMonsterTypes();
      buildOptions('monster_subtype_dropdown',[]);
    })

    const monsterTypeDropdown = document.getElementById('monster_type_dropdown');
    monsterTypeDropdown.addEventListener('change', async () => {
      state.monsterType = parseInt(monsterTypeDropdown.value);
      buildOptions('monster_subtype_dropdown', []);
      loadMonsterSubtypes();
      updateCeilings(state.monsterType);
    })
});