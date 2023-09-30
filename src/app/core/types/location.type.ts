export interface UserLocationPlace extends UserLocation {
    place: string;
}

export interface UserLocation extends Coordinate {
    id: number;
    date: Date;
    isManual: boolean;
    placeId: number | null;
}

export interface Coordinate {
    lat: number | null;
    lon: number | null;
}
