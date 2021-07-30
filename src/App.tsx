import { Component } from 'react';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import theRickAndMortyLogo from './images/the_rick_and_morty.png';

import HomePage from './pages/Home/HomePage';
import CharacterPage from './pages/Character/CharacterPage';

import { fetchPage, fetchCharacter } from './services/CharacterService';

import IPage from './models/IPage';
import ICharacter from './models/ICharacter';

interface IPageMap {
  [key: string]: IPage;
}

interface IAppState {
  pages: IPageMap;
  selectedPage: IPage | null;
  selectedCharacter: ICharacter | null | undefined;
  pageLoading: boolean,
  characterLoading: boolean,
}


/**
 * This is a wrapper component for whole application 
 * Could have introduce Redux but for small application it is unnecessary
 */
class App extends Component<Readonly<{}>, IAppState>{
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      pages: {}, // used for caching the pages to save API calls in a session
      selectedPage: null, // currently shown page with characters list
      selectedCharacter: null, // from characters list if you click any particular character it will take you to details of that character
      pageLoading: false, // to show the loading state of HomePage
      characterLoading: false, // to show the loading state of CharacterPage
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleCharacterChange = this.handleCharacterChange.bind(this);
  }

  /**
   * this method handles the page change
   * you just pass th pageId to be shown rest this methodd will handle
   * we can change a page from Prev+Next+GoToPage buttons OR from URL as well
   * we are memoizing the API response so that we can save network calls across back and forth navigations
   * @param pageId 
   */
  async handlePageChange(pageId: string) {
    this.setState({ ...this.state, pageLoading: true });

    let pageNumber = parseInt(pageId);
    const newState = { ...this.state };
    let page = this.state.pages[pageNumber.toString()]; // checking whether page already exists in cache or not

    if (!page) {
      const result = await fetchPage(pageNumber); // if not then fetch from API call, [service layer]

      if (!result.error) {
        page = result;
        newState.selectedPage = page;
        newState.pages = { ...newState.pages, [pageNumber]: page }; // in case of success of API adding it to cache
      } else {
        newState.selectedPage = null;
      }
    } else {
      newState.selectedPage = page;
    }

    newState.pageLoading = false;
    this.setState(newState);
  }

  /**
   * this method handles the character change
   * we can change a character from HomePage charcters tile list OR from URL too
   * we are re-using the same data from the character tilee if it is not available them calling backend API
   * @param characterId 
   */
  async handleCharacterChange(characterId: number) {
    this.setState({ ...this.state, characterLoading: true });
    let matchedCharacter = this.state.selectedPage?.results.find(character => character.id === characterId) as (ICharacter | undefined | null);
    if (!matchedCharacter) {
      const result = await fetchCharacter(characterId); // REST API Call for character details

      matchedCharacter = result;
      if (result.error) {
        matchedCharacter = null;
      }
    }

    this.setState({ ...this.state, selectedCharacter: matchedCharacter, characterLoading: false });
  }

  render() {
    return (
      <>
        <Router>
          <Link to="/">
            <header className="app-header">
              <img className="app-header-logo" alt="The Rick and Morty" src={theRickAndMortyLogo} />
            </header>
          </Link>
          <main className="app-main-content">
            <Switch>
              <Route path="/character/:characterId" render={(props) => (
                <CharacterPage {...props}
                  character={this.state.selectedCharacter}
                  handleCharacterChange={this.handleCharacterChange}
                  characterLoading={this.state.characterLoading} />)}>
              </Route>
              <Route path="/:pageId" render={(props) => (
                <HomePage {...props}
                  page={this.state.selectedPage}
                  handlePageChange={this.handlePageChange}
                  pageLoading={this.state.pageLoading} />)}>
              </Route>
              {/* added a safe case where user can access plain URL and it will automatically redirect to meaning full HomePage */}
              <Route path="/">
                <Redirect to="/1"></Redirect>
              </Route>
            </Switch>
          </main>
        </Router >
      </>
    );
  }
}


export default App;

