import { getPageNumberFromURL, getEpisodeFromURL } from './Util';

describe('test Util getPageNumberFromURL - functinalities', () => {
    it('getPageNumberFromURL should return -1 for all invalid urls', () => {
        expect(getPageNumberFromURL('')).toBe(-1);
        expect(getPageNumberFromURL('dadadada')).toBe(-1);
        expect(getPageNumberFromURL('https://google.com')).toBe(-1);
        expect(getPageNumberFromURL('https://rickandmortyapi.com/api/characterXX?page=')).toBe(-1);
        expect(getPageNumberFromURL('https://rickandmortyapi.com/api/character')).toBe(-1);
        expect(getPageNumberFromURL('https://rickandmortyapi.com/api/character?page=dadda')).toBe(-1);
    });

    it('getPageNumberFromURL should return expected value for all valid urls', () => {
        expect(getPageNumberFromURL('https://rickandmortyapi.com/api/character?page=1')).toBe(1);
        expect(getPageNumberFromURL('https://rickandmortyapi.com/api/character?page=131')).toBe(131);
        expect(getPageNumberFromURL('https://rickandmortyapi.com/api/character?page=876')).toBe(876);
        expect(getPageNumberFromURL('https://rickandmortyapi.com/api/character?page=0007')).toBe(7);
    });
});

describe('test Util getEpisodeFromURL - functinalities', () => {
    it('getEpisodeFromURL should return "" for all invalid urls', () => {
        expect(getEpisodeFromURL('')).toBe('');
        expect(getEpisodeFromURL('dadadada')).toBe('');
        expect(getEpisodeFromURL('https://google.com')).toBe('');
        expect(getEpisodeFromURL('https://rickandmortyapi.com/api/characterXX?page=')).toBe('');
        expect(getEpisodeFromURL('https://rickandmortyapi.com/api/episodeXX/')).toBe('');
        expect(getEpisodeFromURL('https://rickandmortyapi.com/api/episode')).toBe('');
        expect(getEpisodeFromURL('https://rickandmortyapi.com/api/episodes/113')).toBe('');
    });

    it('getEpisodeFromURL should return expected value for all valid urls', () => {
        expect(getEpisodeFromURL('https://rickandmortyapi.com/api/episode/113')).toBe('113');
        expect(getEpisodeFromURL('https://rickandmortyapi.com/api/episode/1')).toBe('1');
        expect(getEpisodeFromURL('https://rickandmortyapi.com/api/episode/43')).toBe('43');
    });
});
