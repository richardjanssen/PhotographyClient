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

export interface MapLocations {
    currentLocation: Coordinate | null;
    historicLocations: Coordinate[];
}

export interface Coordinate {
    lat: number;
    lon: number;
}
