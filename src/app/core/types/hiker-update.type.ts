import { AlbumDetails } from './album.type';
import { HighlightContentType } from './highlight.type';

export interface HikerUpdate {
    title: string;
    type: HighlightContentType;
    text: string | null;
    distance: number;
    albumId: number | null;
}

export interface HikerUpdateBasic {
    id: number;
    title: string;
    type: HighlightContentType;
    distance: number;
}

export interface HikerUpdateDetails {
    text: string | null;
    album: AlbumDetails | null;
}
