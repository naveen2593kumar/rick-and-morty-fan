import { Component, createRef } from 'react';
import IPage from '../../models/IPage';
import classes from './HomePage.module.css';
import CharacterTile from '../../components/CharacterTile';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { getPageNumberFromURL } from '../../utils/Util';


interface IHomePageProps {
    page: IPage | null;
    handlePageChange: Function;
    pageLoading: boolean;
}


/**
 * This component is reponsible for showing pages with characters in a tile grid 
 */
class HomePage extends Component<IHomePageProps & RouteComponentProps<{ pageId: string }>> {
    private pageRef: React.RefObject<HTMLInputElement>; // for input to get page number

    constructor(props: IHomePageProps & RouteComponentProps<{ pageId: string }>) {
        super(props);

        this.pageRef = createRef();
        this.handleGoToPageClick = this.handleGoToPageClick.bind(this);
    }

    componentDidMount() {
        // To fetch RickMortyPages as per given URL parameter
        const pageId = this.props?.match?.params?.pageId;
        this.props.handlePageChange(pageId);

        if (this.pageRef.current) {
            this.pageRef.current.value = pageId;
        }
    }

    /**
     * this is handler to go backwards and forward in pages list
     * @param step 
     */
    handlePageNavigation(step: number) {
        const direction = step > 0 ? 'next' : 'prev';
        const url = this.props.page?.info[direction];
        const pageNumber = getPageNumberFromURL(url);

        if (pageNumber > 0) {
            this.props.handlePageChange(pageNumber);
            this.props.history.push(`/${(pageNumber)}`);
            if (this.pageRef.current) {
                this.pageRef.current.value = pageNumber.toString();
            }
        }
    }

    /**
     * this is handler to go to aparticular page as per user input
     */
    handleGoToPageClick() {
        // normalisiing the input in a range of 1 to MAX pages as per API response in this case we check
        // we refer page.info.pages means it is dynamic, in future it will work for thousand of pages as well
        let pageNum = parseInt(this.pageRef.current?.value || '0');
        const maxPage = (this.props.page?.info.pages || 1);

        if (maxPage < pageNum) {
            pageNum = maxPage;
        }
        if (pageNum < 0) {
            pageNum = 1;
        }

        this.props.handlePageChange(pageNum);
        this.props.history.push(`/${(pageNum)}`);

        if (this.pageRef.current) {
            this.pageRef.current.value = pageNum.toString();
        }
    }

    render() {
        const { page, pageLoading } = this.props;
        // Navigation block with Prev+Next+GoToPage buttons
        const Navigation = (
            <nav className={classes['navigation-box']}>
                {
                    page ? <>
                        <div className={classes['navigation-box-buttons']}><button
                            data-testid="prevButton"
                            disabled={getPageNumberFromURL(this.props.page?.info.prev) === -1}
                            onClick={() => { this.handlePageNavigation(-1) }}>Prev</button>

                            <button
                                data-testid="nextButton"
                                disabled={getPageNumberFromURL(this.props.page?.info.next) === -1}
                                onClick={() => { this.handlePageNavigation(1); }}>Next</button>
                        </div>
                        <div className={classes['navigation-box-input']}>
                            <input
                                id="page"
                                data-testid="pageInputField"
                                type="number"
                                ref={this.pageRef}
                                max={page.info.pages}
                                style={{ backgroundColor: '#fff', color: '#22a2bd', width: 50, padding: 8 }} />
                            <button
                                data-testid="goToPageButton"
                                onClick={this.handleGoToPageClick}>Go to page</button>
                        </div>
                    </>
                        :
                        <button
                            data-testid="homeButton"
                            onClick={() => { this.props.history.push('/'); }}>Home</button>}

            </nav>);

        // Navigation + Loading screen
        if (pageLoading) {
            return <>{Navigation}<div className="message" style={{ color: '#00f' }}>Please wait...</div></>;
        }

        // Navigation + Error screen
        if (!page) {
            return <>{Navigation}<div className="message" style={{ color: '#f00' }}>We have checked the whole "The Rick and Morty" universe but could not find what you are looking for!</div></>;
        }

        // Navigation + Content screen
        return <>{Navigation}<div className={classes.gallery}>
            {page.results.map(character =>
                <Link
                    key={character.id}
                    style={{ textDecoration: 'none' }}
                    to={`/character/${character.id}`}>
                    <CharacterTile character={character} /></Link>)}
        </div></>;
    }
}

export default HomePage;
