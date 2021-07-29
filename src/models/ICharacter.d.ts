interface ILocation {
    name: string;
    url: string;
}

interface ICharacter {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: ILocation;
    location: ILocation;
    image: string;
    episode: string[];
    url: string;
}

export default ICharacter;