export interface Highlight {
    type: HighlightType;
    sectionHighlight: SectionHighlight | null;
    pointHighlight: PointHighlight | null;
}

export interface SectionHighlight {
    title: string;
    type: SectionHighlightType;
    startDistance: number;
    endDistance: number;
    firstEntered: Date | null;
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

export enum SectionHighlightType {
    desert = 'desert',
    sparseForest = 'sparseForest',
    denseForest = 'denseForest'
}

export enum PointHighlightType {
    photo = 'photo',
    blog = 'blog',
    location = 'location',
    town = 'town',
    lodge = 'lodge',
    lake = 'lake',
    highway = 'highway',
    mountainSummit = 'mountainSummit',
    mountainPass = 'mountainPass',
    mountainBypass = 'mountainBypass',
    waterfall = 'waterfall',
    bridgeOfTheGods = 'bridgeOfTheGods',
    terminus = 'terminus',
    laAqueduct = 'laAqueduct',
    devilsPostpile = 'devilsPostpile',
    castleCrags = 'castleCrags',
    fiveHundred = 'fiveHundred',
    oneThousand = 'oneThousand',
    fifteenHundred = 'fifteenHundred',
    twoThousand = 'twoThousand',
    twentyFiveHundred = 'twentyFiveHundred',
    threeThousand = 'threeThousand',
    thirtyFiveHundred = 'thirtyFiveHundred',
    fourThousand = 'fourThousand'
}
