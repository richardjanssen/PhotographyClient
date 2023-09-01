import { Pipe, PipeTransform } from '@angular/core';
import { DataStatus } from '../../types/data-status.types';

@Pipe({ name: 'data', standalone: true })
export class DataPipe implements PipeTransform {
    transform<T>(dataStatus: DataStatus<T>): T | null {
        return dataStatus.value;
    }
}
