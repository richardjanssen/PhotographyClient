import { Pipe, PipeTransform } from '@angular/core';
import { DataStatus, StateStatus } from '../../types/data-status.types';

@Pipe({ name: 'loading', standalone: true })
export class LoadingPipe implements PipeTransform {
    transform<T>(dataStatus: DataStatus<T>): boolean {
        return dataStatus.status === StateStatus.inProgress;
    }
}
