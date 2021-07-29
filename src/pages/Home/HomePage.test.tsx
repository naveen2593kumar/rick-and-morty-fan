import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';
import data from '../../models/page-data';
import { MemoryRouter, Route, Link } from "react-router-dom";

describe('HomePage Renders', () => {
  let handlePageChangeMock: jest.Mock;

  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(data),
    }));
    handlePageChangeMock = jest.fn();
  });

  afterEach(() => {
    // @ts-ignore
    global.fetch.mockClear();
    // @ts-ignore
    handlePageChangeMock.mockClear();
  });

  it('when page is "null" loading is "false" then it should show Error screen', async () => {
    render(
      <MemoryRouter>
        <Route path="/:pageId" render={(props) => (
          <HomePage {...props}
            page={null}
            handlePageChange={handlePageChangeMock}
            pageLoading={false} />
        )}>
        </Route>
        <Link to="/1" data-testid="link">1</Link>
      </MemoryRouter>
    );

    const link = screen.getByTestId('link');

    await waitFor(async () => {
      await userEvent.click(link);
    });
    // We should get Error Screen
    screen.getByText(/We have checked the whole "The Rick and Morty" universe but could not find what you are looking for!/);
  });

  it('when page is "null" loading is "true" then it should show Loading screen', async () => {
    render(
      <MemoryRouter>
        <Route path="/:pageId" render={(props) => (
          <HomePage {...props}
            page={null}
            handlePageChange={handlePageChangeMock}
            pageLoading={true} />
        )}>
        </Route>
        <Link to="/1" data-testid="link">1</Link>
      </MemoryRouter>
    );

    const link = screen.getByTestId('link');

    await waitFor(async () => {
      await userEvent.click(link);
    });
    // We should get loading Screen
    screen.getByText(/Please wait../);
  });

  it('when page is "valid" loading is "false" then it should show content screen as per provided data', async () => {
    render(
      <MemoryRouter>
        <Route path="/:pageId" render={(props) => (
          <HomePage {...props}
            page={data}
            handlePageChange={handlePageChangeMock}
            pageLoading={false} />
        )}>
        </Route>
        <Link to="/1" data-testid="link">1</Link>
      </MemoryRouter>
    );

    const link = screen.getByTestId('link');

    await waitFor(async () => {
      await userEvent.click(link);
    });

    // We should get content Screen
    screen.getByText(data.results[0].name);
    screen.getByText(data.results[1].name);

    screen.getAllByText(new RegExp(data.results[0].gender));
    screen.getAllByText(new RegExp(data.results[1].gender));
    expect(handlePageChangeMock.mock.calls.length).toBe(1);
    expect(handlePageChangeMock.mock.calls[0][0]).toBe('1');
    const pageInputField = screen.getByTestId('pageInputField');
    const goToPageButton = screen.getByTestId('goToPageButton');
    await waitFor(async () => {
      await userEvent.type(pageInputField, '2'); // appends in input field
      await userEvent.click(goToPageButton);
    });
    expect(handlePageChangeMock.mock.calls.length).toBe(2);
    expect(handlePageChangeMock.mock.calls[1][0]).toBe(12);

    await waitFor(async () => {
      await userEvent.type(pageInputField, '111'); // very high number so our logic will chaange it to max pages number
      await userEvent.click(goToPageButton);
    });
    expect(handlePageChangeMock.mock.calls.length).toBe(3); // 3rd time changed
    expect(handlePageChangeMock.mock.calls[2][0]).toBe(data.info.pages);

    const prevButton = screen.getByTestId('prevButton');
    const nextButton = screen.getByTestId('nextButton');
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    await waitFor(async () => {
      await userEvent.click(nextButton); // 4th Time
      await userEvent.click(nextButton); // 5th Time
      await userEvent.click(nextButton); // 6th Time
    });

    expect(handlePageChangeMock.mock.calls.length).toBe(6); // 4th time changed
    expect(handlePageChangeMock.mock.calls[5][0]).toBe(2); // data would be same as we are responding with same mocking 
  });
});
