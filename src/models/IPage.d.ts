import ICharacter from "./ICharacter";

interface IPageInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

interface IPage {
    info: IPageInfo;
    results: ICharacter[];
}

export default IPage;