export interface UserLocationPlace extends UserLocation {
    place: string;
}

export interface UserLocation extends Coordinate {
    id: number;
    date: Date;
    isManual: boolean;
    distance: number | null;
    placeId: number | null;
    sectionId: number | null;
}

export interface Coordinate {
    lat: number | null;
    lon: number | null;
}
