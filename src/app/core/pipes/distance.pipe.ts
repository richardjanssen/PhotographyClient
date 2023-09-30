import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'distance',
    standalone: true
})
export class DistancePipe implements PipeTransform {
    transform<T>(value: number | null): string {
        if (value === null || value === undefined) {
            return '-';
        }
        return `${Math.round(value).toString()} km`;
    }
}
