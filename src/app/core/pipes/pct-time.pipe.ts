import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ConstantsService } from '../services/constants.service';

@Pipe({
    name: 'pctTime',
    standalone: true
})
export class PctTimePipe implements PipeTransform {
    constructor(private readonly _constants: ConstantsService) {}

    transform(date: Date): string {
        const pipe = new DatePipe('en-US');
        if (new Date(date).valueOf() > this._constants.pctStartDate.valueOf()) {
            // Has started hike, Pacific Daylight Saving Time
            return `${pipe.transform(date, 'HH:mm', 'PDT')} PDT`;
        }
        // Central European Daylight saving Time
        if (new Date(date).valueOf() > new Date(2024, 2, 30).valueOf()) {
            return `${pipe.transform(date, 'HH:mm', '+0200')} CEST`;
        }
        // Central European Time
        return `${pipe.transform(date, 'HH:mm', '+0100')} CET`;
    }
}
