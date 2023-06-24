export interface UserLocation {
    id: number;
    date: Date;
    actualDistance: number | null;
    roundedDistance: number | null;
    isManual: boolean;
    lat: number | null;
    lon: number | null;
}
