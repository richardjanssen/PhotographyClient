export interface DataInProgress<T> {
    status: StateStatus.inProgress;
    value: T | null;
}

export interface DataValid<T> {
    status: StateStatus.valid;
    value: T;
}

export interface DataError {
    status: StateStatus.error;
    value: null;
}

export type DataStatus<T> = DataInProgress<T> | DataValid<T> | DataError;

export enum StateStatus {
    unknown = 0,
    valid = 1,
    inProgress = 2,
    error = 3
}
