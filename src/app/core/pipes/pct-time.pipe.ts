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
            // Has started hike
            return `${pipe.transform(date, 'HH:mm', 'PDT')} PDT`;
        }
        return `${pipe.transform(date, 'HH:mm', 'CEST')} CEST`;
    }
}
