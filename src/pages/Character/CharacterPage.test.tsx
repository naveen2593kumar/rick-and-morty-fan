import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterPage from './CharacterPage';
import data from '../../models/page-data';
import { MemoryRouter, Route, Link } from "react-router-dom";

describe('CharacterPage Renders', () => {
  let handleCharacterChangeMock: jest.Mock;

  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(data),
    }));
    handleCharacterChangeMock = jest.fn();
  });

  afterEach(() => {
    // @ts-ignore
    global.fetch.mockClear();
    // @ts-ignore
    handleCharacterChangeMock.mockClear();
  });

  it('when page is "null" loading is "false" then it should show Error screen', async () => {
    render(
      <MemoryRouter>
        <Route path="/character/:characterId" render={(props) => (
          <CharacterPage {...props}
            character={null}
            handleCharacterChange={handleCharacterChangeMock}
            characterLoading={false} />
        )}>
        </Route>
        <Link to="/character/1" data-testid="link">1</Link>
      </MemoryRouter>
    );

    const link = screen.getByTestId('link');

    await waitFor(async () => {
      await userEvent.click(link);
    });
    // We should get Error Screen
    screen.getByText(/Character not found in the whole "The Rick and Morty" universe/);
  });

  it('when page is "null" loading is "true" then it should show Loading screen', async () => {
    render(
      <MemoryRouter>
        <Route path="/character/:characterId" render={(props) => (
          <CharacterPage {...props}
            character={data.results[0]}
            handleCharacterChange={handleCharacterChangeMock}
            characterLoading={true} />
        )}>
        </Route>
        <Link to="/character/1" data-testid="link">1</Link>
      </MemoryRouter>
    );

    const link = screen.getByTestId('link');

    await waitFor(async () => {
      await userEvent.click(link);
    });
    // We should get loading Screen
    screen.getByText(/Please wait../);
  });

  it('when character is "valid" loading is "false" then it should show content screen as per provided data', async () => {
    render(
      <MemoryRouter>
        <Route path="/character/:characterId" render={(props) => (
          <CharacterPage {...props}
            character={data.results[0]}
            handleCharacterChange={handleCharacterChangeMock}
            characterLoading={false} />
        )}>
        </Route>
        <Link to="/character/1" data-testid="link">1</Link>
      </MemoryRouter>
    );

    const link = screen.getByTestId('link');

    await waitFor(async () => {
      await userEvent.click(link);
    });

    // We should get content Screen
    screen.getByText(data.results[0].name);
    screen.getByText(data.results[0].status);
    screen.getByText(data.results[0].gender);
    screen.getByText(data.results[0].species);
    screen.getByText(data.results[0].origin.name);
    screen.getByText(data.results[0].location.name);
    const list = screen.getAllByText(/Episode/);
    expect(list.length).toBe(data.results[0].episode.length + 1);// One extra for label
    const goBackButton = screen.getByTestId('goBackButton');

    await waitFor(async () => {
      await userEvent.click(goBackButton);
    });

    expect(handleCharacterChangeMock.mock.calls.length).toBe(1); // 4th time changed
    expect(handleCharacterChangeMock.mock.calls[0][0]).toBe(1); // data would be same as we are responding with same mocking 

    expect(goBackButton).not.toBeInTheDocument(); // as page woould have been changed 
  });
});
