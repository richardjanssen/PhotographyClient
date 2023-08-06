export interface UserLocation {
    id: number;
    date: Date;
    isManual: boolean;
    placeId: number | null;
    lat: number | null;
    lon: number | null;
}
