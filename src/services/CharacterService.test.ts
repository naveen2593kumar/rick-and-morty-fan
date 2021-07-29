import { fetchPage, fetchCharacter } from './CharacterService';

describe('test service function', () => {
    beforeEach(() => {
        // @ts-ignore
        // Ideally we should create jest mock but this is far easy way
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ success: 1 }),
        }));
    });

    afterEach(() => {
        // @ts-ignore
        global.fetch.mockClear();
    });

    it('fetchPage should return expected API response', async () => {
        const result = await fetchPage();
        expect(result).toMatchObject({ success: 1 });
    });

    it('fetchCharacter should return expected API response', async () => {
        const result = await fetchCharacter(1);
        expect(result).toMatchObject({ success: 1 });
    });
});
