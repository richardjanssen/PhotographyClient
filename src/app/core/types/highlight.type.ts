export interface Highlight {
    type: HighlightType;
    sectionHighlight: SectionHighlight | null;
    pointHighlight: PointHighlight | null;
}

export interface SectionHighlight {
    highlightIndex: number;
    title: string;
    children: PointHighlight[];
}

export interface PointHighlight {
    highlightIndex: number;
    distance: number;
    currentLocation: boolean;
    points: Point[];
}

export interface Point {
    id: number | null;
    placeType: HighlightContentType;
    title: string;
}

export enum HighlightType {
    place = 'place',
    section = 'section'
}

export enum HighlightContentType {
    photo = 'photo',
    blog = 'blog',
    location = 'location',
    town = 'town',
    other = 'other'
}

export enum AlignmentType {
    left = 'left',
    right = 'right',
    leftIncoming = 'leftIncoming',
    rightIncoming = 'rightIncoming'
}

export interface HighlightExpansion {
    sectionIndex: number;
    pointIndex: number;
    isExpanded: boolean;
}
