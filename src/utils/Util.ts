import { BASE_URL } from '../services/CharacterService';

/**
 * Fetch page from URL so that it can be used as Number for caching the PAGES
 * @param url 
 */
export const getPageNumberFromURL = (url: string | null | undefined) => {
    if (!url) return -1;
    const pathParts = url.split(`${BASE_URL}character?page=`);
    const result = parseInt(pathParts[1] || '-1');
    return isNaN(result) ? -1 : result;
}

/**
 * Fetch Episode from URL so that it can be shown in human readable format
 * @param url 
 */
export const getEpisodeFromURL = (url: string | null | undefined) => {
    if (!url) return '';
    const pathParts = url.split(`${BASE_URL}episode/`);

    return pathParts[1] || '';
}