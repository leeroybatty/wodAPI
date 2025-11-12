type ApiQueryParameters = {
  books?: string[]
}

type Monster = {
  id: number;
  name: string;
}

type Stat = {
  id: number;
  name: string;
}

type ApiResponse<T> = {
  data: T;
  ok?: boolean;
}

type CommonQueryParams = {
  books?: string[];
  year?: number;
  faction?: number;
  monster?: string;
  exclude?: string[];
  include?: string[];
}

const buildQueryParams = (params: CommonQueryParams): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (params.books?.length) {
    searchParams.append('books', params.books.join(','));
  }
  if (params.year !== undefined) {
    searchParams.append('year', params.year.toString());
  }
  if (params.faction !== undefined) {
    searchParams.append('faction', params.faction.toString());
  }
  if (params.monster) {
    searchParams.append('monster', params.monster);
  }
  if (params.exclude?.length) {
    searchParams.append('exclude', params.exclude.join(','));
  }
  if (params.include?.length) {
    searchParams.append('include', params.include.join(','));
  }
  return searchParams;
}

export const getTemplates = async (params: CommonQueryParams = {}): Promise<Monster[]> => {
  const queryParams = buildQueryParams(params);
  const response = await fetch(`/api/monsters?${queryParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch monsters: ${response.status}`);
  }
  const result: ApiResponse<{ monsters: Monster[] }> = await response.json();
  return result.data.monsters;
}

export const getMonsters = async (
  monster: string | number,
  params: CommonQueryParams = {}
): Promise<Monster[]> => {
  const queryParams = buildQueryParams(params);
  const response = await fetch(`/api/monsters/${monster}/type?${queryParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch monsters: ${response.status}`);
  }
  const result: ApiResponse<{ monsters: Monster[] }> = await response.json();
  return result.data.monsters;
}

export const getStatSet = async (
  category: string,
  params: CommonQueryParams = {}
): Promise<Stat[]> => {
  const queryParams = buildQueryParams(params);
  const response = await fetch(`/api/stats/${category}?${queryParams}`);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const result: ApiResponse<{ stats: Stat[] }> = await response.json();
  return result.data.stats;
}

export const getArchetypes = async (params: CommonQueryParams = {}): Promise<Monster[]> => {
  const queryParams = buildQueryParams(params);
  const response = await fetch(`/api/stats/archetype?${queryParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch archetypes: ${response.status}`);
  }
  const result: ApiResponse<{ stats: Stat[] }> = await response.json();
  return result.data.stats;
}

export const getOrganizations = async (
  monster: string | number,
  params: CommonQueryParams = {}
): Promise<Organization[]> => {
  const queryParams = buildQueryParams(params);
  const response = await fetch(`/api/organizations/${monster}?${queryParams}`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Failed to fetch organizations: ${response.status}`);
  }
  const result: ApiResponse<{ organizations: Organization[] }> = await response.json();
  return result.data.organizations;
}

export const getPowers = async (
  monster: string | number,
  params: CommonQueryParams = {}
): Promise<Stat[]> => {
  const queryParams = buildQueryParams(params);
  const response = await fetch(`/api/stats/powers/${monster}?${queryParams}`);
   if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Failed to fetch powers: ${response.status}`);
  }
  const result: ApiResponse<{ stats: Stat[] }> = await response.json();
  return result.data.stats;
};


export const getPathVirtues = async (
  path: string | number,
  params: CommonQueryParams = {}
): Promise<Stat[]> => {
  const queryParams = buildQueryParams(params);
  const response = await fetch(`/api/stats/virtues/${path}?${queryParams}`);
   if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Failed to fetch virtues: ${response.status}`);
  }
  const result: ApiResponse<{ stats: Stat[] }> = await response.json();
  return result.data.stats
};
