export interface Highlight {
    id: number;
    title: string;
    distance: number;
    type: HighlightType;
    currentLocation: boolean;
}

export enum HighlightType {
    town = 'town',
    photos = 'photos',
    other = 'other'
}
