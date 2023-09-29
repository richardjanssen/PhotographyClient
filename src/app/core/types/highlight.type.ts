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
    id: number;
    date: Date;
    placeType: HighlightContentType;
    title: string;
    distance: number | null;
    isManual: boolean;
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
