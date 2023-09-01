import { Pipe, PipeTransform } from '@angular/core';
import { DataStatus, StateStatus } from '../../types/data-status.types';

@Pipe({ name: 'valid', standalone: true })
export class ValidPipe implements PipeTransform {
    transform<T>(dataStatus: DataStatus<T>): boolean {
        return dataStatus.status === StateStatus.valid;
    }
}
