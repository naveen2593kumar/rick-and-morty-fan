export const BASE_URL = 'https://rickandmortyapi.com/api/';


/**
 * fetch RickAndMorty list of characters as per Page ID in a paginated manner
 * @param pageId 
 */
export const fetchPage = async (pageId: number = 1) => {
    // https://rickandmortyapi.com/api/character?page=1
    const response = await fetch(`${BASE_URL}character?page=${pageId}`);
    return await response.json();
}

/**
 * fetch RickAndMorty Character as per provided characterId
 * @param characterId 
 */
export const fetchCharacter = async (characterId: number) => {
    // https://rickandmortyapi.com/api/character/1
    const response = await fetch(`${BASE_URL}character/${characterId}`);
    return await response.json();
}

