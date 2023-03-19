export interface Highlight {
    id: number;
    title: string;
    distance: number;
    type: HighlightType;
    contentType: HighlightContentType;
    currentLocation: boolean;
    children: Highlight[];
}

export enum HighlightType {
    place = 'place',
    section = 'section'
}

export enum HighlightContentType {
    town = 'town',
    photo = 'photo',
    other = 'other'
}

export enum AlignmentType {
    left = 'left',
    right = 'right',
    leftIncoming = 'leftIncoming',
    rightIncoming = 'rightIncoming'
}

export interface HighlightExpansion {
    id: number;
    isExpanded: boolean;
}
