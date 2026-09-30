import { Pipe, PipeTransform } from '@angular/core';
import { Weekday } from '../types/weekmenu/weekmenu.type';

@Pipe({
    name: 'weekday',
    standalone: true
})
export class DistancePipe implements PipeTransform {
    transform(value: Weekday): string {
        switch (value) {
            case Weekday.monday:
                return 'Ma';
            case Weekday.tuesday:
                return 'Di';
            case Weekday.wednesday:
                return 'Wo';
            case Weekday.thursday:
                return 'Do';
            case Weekday.friday:
                return 'Vr';
            case Weekday.saturday:
                return 'Za';
            case Weekday.sunday:
                return 'Zo';
            default:
                return '';
        }
    }
}
