export interface WeekmenuDay {
    id: number | null;
    rowVersion: number | null;
    weekday: Weekday;
    name: string;
}

export enum Weekday {
    monday = 'Monday',
    tuesday = 'Tuesday',
    wednesday = 'Wednesday',
    thursday = 'Thursday',
    friday = 'Friday',
    saturday = 'Saturday',
    sunday = 'Sunday'
}
