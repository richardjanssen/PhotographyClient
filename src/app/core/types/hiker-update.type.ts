import { AlbumDetails } from './album.type';
import { HighlightContentType } from './highlight.type';

export interface HikerUpdate {
    title: string;
    type: HighlightContentType;
    text: string | null;
    distance: number | null;
    placeId: number | null;
    albumId: number | null;
}

export interface HikerUpdateBasic {
    id: number;
    date: Date;
    title: string;
    type: HighlightContentType;
    distance: number;
}

export interface HikerUpdateDetails {
    text: string | null;
    album: AlbumDetails | null;
}
