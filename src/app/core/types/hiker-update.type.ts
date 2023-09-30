import { AlbumDetails } from './album.type';
import { PointHighlightType } from './highlight.type';

export interface HikerUpdate {
    id: number | null;
    title: string;
    type: PointHighlightType;
    text: string | null;
    distance: number | null;
    placeId: number | null;
    albumId: number | null;
}

export interface HikerUpdateBasic {
    id: number;
    date: Date;
    title: string;
    type: PointHighlightType;
    distance: number;
}

export interface HikerUpdateDetails {
    text: string | null;
    album: AlbumDetails | null;
}
