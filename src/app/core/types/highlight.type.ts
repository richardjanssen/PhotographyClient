export interface Highlight {
    title: string;
    distance: number;
    type: HighlightType;
}

export enum HighlightType {
    town = 'town',
    photos = 'photos',
    other = 'other'
}
