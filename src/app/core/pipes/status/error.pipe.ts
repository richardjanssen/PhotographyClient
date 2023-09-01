import { Pipe, PipeTransform } from '@angular/core';
import { DataStatus, StateStatus } from '../../types/data-status.types';

@Pipe({ name: 'error', standalone: true })
export class ErrorPipe implements PipeTransform {
    transform<T>(dataStatus: DataStatus<T>): boolean {
        return dataStatus.status === StateStatus.error;
    }
}
