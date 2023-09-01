import { Observable, OperatorFunction } from 'rxjs';
import { DataStatus, StateStatus } from '../types/data-status.types';

export function inspectStatus<T>(): OperatorFunction<T, DataStatus<T>> {
    return source =>
        new Observable(observer => {
            observer.next({ status: StateStatus.inProgress, value: null });
            return source.subscribe({
                next: value => {
                    observer.next({ status: StateStatus.valid, value });
                },
                error: error => {
                    observer.next({ status: StateStatus.error, value: null });
                    observer.error(error);
                },
                complete: () => observer.complete()
            });
        });
}
