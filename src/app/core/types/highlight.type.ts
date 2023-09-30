export interface Highlight {
    type: HighlightType;
    sectionHighlight: SectionHighlight | null;
    pointHighlight: PointHighlight | null;
}

export interface SectionHighlight {
    title: string;
    startDistance: number;
    endDistance: number;
    children: PointHighlight[];
}

export interface PointHighlight {
    id: number;
    date: Date;
    type: PointHighlightType;
    title: string;
    distance: number | null;
    isManual: boolean;
}

export enum HighlightType {
    place = 'place',
    section = 'section'
}

export enum PointHighlightType {
    photo = 'photo',
    blog = 'blog',
    location = 'location',
    town = 'town',
    enterSection = 'enterSection',
    other = 'other'
}
