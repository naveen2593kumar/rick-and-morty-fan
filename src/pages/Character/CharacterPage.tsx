import { Component } from "react";
import ICharacter from "../../models/ICharacter";
import { RouteComponentProps } from 'react-router';
import AliveStatus from "../../commons/AliveStatus";
import { getEpisodeFromURL } from "../../utils/Util";
import classes from "./CharacterPage.module.css";

interface ICharacterPageProps {
    character: ICharacter | null | undefined;
    handleCharacterChange: Function;
    characterLoading: boolean,
}

/**
 * This component will show the character details
 */
class CharacterPage extends Component<ICharacterPageProps & RouteComponentProps<{ characterId: string }>> {

    componentDidMount() {
        const characterId = this.props?.match?.params?.characterId;
        this.props.handleCharacterChange(parseInt(characterId));
    }

    render() {
        const { character, characterLoading } = this.props;
        // Go back navigation
        const GoBack = <button data-testid="goBackButton" onClick={() => { this.props.history.goBack() }}>&lt; Go Back</button>;

        // Go back navigation + loading screen
        if (characterLoading) {
            return (<>{GoBack}<div className="message" style={{ color: '#00f' }}>Please wait...</div></>);
        }

        // Go back navigation + Error screen
        if (!character) {
            return <>{GoBack}<div className="message" style={{ color: '#f00' }}>Character not found in the whole "The Rick and Morty" universe !</div></>
        }

        // Go back navigation + Main Content
        return (<>
            {GoBack}
            <section className={classes.wrapper} >
                <div className={classes['profile-picture']}>
                    <img style={{ width: '100%' }} alt={character.name} src={character.image} />
                </div>
                <div className={classes['profile-details']}>
                    <div className={classes['profile-details-title']}>{character.name}</div>
                    <div className={classes['profile-details-item']}>
                        <b>Status:</b> <AliveStatus status={character.status} /> {character.status}
                    </div>
                    <div className={classes['profile-details-item']}>
                        <b>Gender:</b> {character.gender}
                    </div>
                    <div className={classes['profile-details-item']}>
                        <b>Species:</b> {character.species}
                    </div>
                    {character.type ? <div className={classes['profile-details-item']}><b>Type:</b> {character.type}</div> : null}

                    <div className={classes['profile-details-item']}>
                        <b>Origin location:</b> <a target="_blank" rel="noreferrer" href={character.origin.url}>{character.origin.name}</a>
                    </div>
                    {
                        character.location
                            ? <div className={classes['profile-details-item']}><b>Current location:</b> <a target="_blank" rel="noreferrer" href={character.location.url}>{character.location.name}</a></div>
                            : null
                    }
                    {
                        Array.isArray(character.episode)
                            ? <div style={{ marginTop: 8 }}>
                                <b>Featured Episodes:</b><br />
                                <div className={classes['chip-wrapper']}>
                                    {character.episode.map(episodeItem => (
                                        <a
                                            key={episodeItem}
                                            className={classes.chip}
                                            target="_blank"
                                            rel="noreferrer"
                                            href={episodeItem}>
                                            Episode&nbsp;{getEpisodeFromURL(episodeItem)}
                                        </a>))}
                                </div></div>
                            : null
                    }
                </div>
            </section></>
        );
    }
}

export default CharacterPage