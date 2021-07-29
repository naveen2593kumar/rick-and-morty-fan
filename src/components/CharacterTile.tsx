import ICharacter from "../models/ICharacter";
import classes from './CharacterTile.module.css';
import AliveStatus from '../commons/AliveStatus';

interface CharacterTileProps {
    character: ICharacter;
}

/**
 * Show Character crisp details
 * 
 * I am skipping testsing for this component given 2 reasons 
 * 1: it is a stateless and UI component
 * 2: this has been tested under HomePage and App component already
 * @param props 
 */
const CharacterTile = (props: CharacterTileProps) => {
    const { character } = props;

    return (
        <section className={classes.tile} title="Click me for more details">
            <div className={classes.image}>
                <img className={classes['image-img']} src={character.image} alt={character.name} />
            </div>
            <div className={classes.details}>
                <div style={{ display: 'flex' }}><div>{character.name}</div><div style={{ flex: 1 }}></div><AliveStatus status={character.status} /></div>
                <div className={classes['sub-details']}>
                    <div className={classes['sub-details-line']}>{character.species} - {character.gender}</div>
                    <div className={classes['sub-details-line']}>
                        {character.type ? <div className={classes['sub-details-line']}><b>Type:</b> {character.type}</div> : null}
                    </div>
                    <div className={classes['sub-details-line']}><b>Origin:</b> - {character.origin.name}</div>
                    <div className={classes['sub-details-line']}><b>Now:</b> - {character.location.name}</div>
                </div>
            </div>
        </section >
    );
}

export default CharacterTile;