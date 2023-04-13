import { HighlightContentType } from './highlight.type';

export interface HikerUpdate {
    title: string;
    type: HighlightContentType;
    text: string | null;
    distance: number;
    albumId: number | null;
}
