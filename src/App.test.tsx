import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import data from './models/page-data';

describe('App Renders', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(data),
    }));
  });

  afterEach(() => {
    // @ts-ignore
    global.fetch.mockClear();
  });

  it('initial render of App component', () => {
    render(<App />);
    screen.getByAltText(/The Rick and Morty/);
    screen.getByTestId('homeButton');
  });

  it('initial render of App component with valid mock data', async () => {
    await waitFor(() => {
      render(<App />);
    });

    screen.getByAltText(/The Rick and Morty/);
    screen.getByTestId('prevButton');
    screen.getByTestId('nextButton');
    screen.getByTestId('pageInputField');
    screen.getByTestId('pageInputField');
    screen.getByTestId('goToPageButton');
    screen.getByText(data.results[0].name); // First Character Tile
    screen.getByText(data.results[1].name); // Second Character Tile
  });

  it('Checking UI with error from APIs on HomePage', async () => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ error: 'MESSAGE' }),
    }));
    await waitFor(() => {
      render(<App />);
    });

    screen.getByText(/We have checked the whole "The Rick and Morty" universe but could not find what you are looking for!/);
  });

  it('Check Routing for Character Page with mock data', async () => {
    await waitFor(() => {
      render(<App />);
    });

    screen.getByAltText(/The Rick and Morty/);
    screen.getByTestId('prevButton');
    screen.getByTestId('nextButton');
    screen.getByTestId('pageInputField');
    screen.getByTestId('goToPageButton');
    screen.getByText(data.results[0].name);
    const secondElement = screen.getByText(data.results[1].name);

    await waitFor(() => {
      userEvent.click(secondElement); // click second character
    });
    screen.getByText(data.results[1].name);
    screen.getByText(/Go Back/); // button of charcter details page
    //Hence proved Routing and component rendering is working fine
  });

  it('Checking UI with error from APIs on Character Page', async () => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ error: 'MESSAGE' }),
    }));
    await waitFor(() => {
      render(<App />);
    });

    screen.getByText(/Character not found in the whole "The Rick and Morty" universe !/);
    const goBackButton = screen.getByTestId('goBackButton');
    await waitFor(async () => {
      await userEvent.click(goBackButton);
    });
  });
});
