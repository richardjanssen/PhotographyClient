import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nullableDisplay',
    standalone: true
})
export class NullableDisplayPipe implements PipeTransform {
    transform<T>(value: T | null | undefined): T | string {
        if (value === null || value === undefined) {
            return '-';
        }
        return value;
    }
}
