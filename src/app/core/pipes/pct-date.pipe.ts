import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ConstantsService } from '../services/constants.service';

@Pipe({
    name: 'pctDate',
    standalone: true
})
export class PctDatePipe implements PipeTransform {
    constructor(private readonly _constants: ConstantsService) {}

    transform(date: Date): string {
        const pipe = new DatePipe('en-US');
        if (new Date(date).valueOf() > this._constants.pctStartDate.valueOf()) {
            // Has started hike
            return `${pipe.transform(date, 'dd-MM-yyyy', 'PDT')}`;
        }
        return `${pipe.transform(date, 'dd-MM-yyyy', 'CEST')}`;
    }
}
