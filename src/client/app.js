const stagelist = {
  'monster': {
    getChoices: "/api/monsters/vampire/type"
  },
  'clan': {
    getChoices: "/api/monsters/vampire/type",
  },
  'nature': {
    getChoices: "/api/stats/archetype",
  },
  'demeanor': {
    getChoices: "/api/stats/archetype",
  }
};

const splats = [
  {
    corebook: 'Vampire: The Masquerade 20th Anniversary Core',
    name: 'Vampire'
  },
  {
    corebook: 'Mage: The Ascension 20th Anniversary Core',
    name: 'Mage'
  }
];

let state = {
  stage: 'clan',
  choices: []
}

async function getStageChoices() {
  const stageData = stagelist[state.stage];
  const {getChoices} = stageData;
  const params = stageData.filters || "";
  try {
    const response = await fetch(`${getChoices}?format=names${params}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
      const result = await response.json();
      console.dir(result);

  } catch (error) {
    console.error(error.message);
  }
}

getStageChoices();