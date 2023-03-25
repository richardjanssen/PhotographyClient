import { Photo } from './photo.type';

export interface Album {
    id: number | null;
    title: string;
}

export interface AlbumDetails {
    photos: Photo[];
}
