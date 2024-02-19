import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConstantsService {
    get pctStartDate(): Date {
        return new Date(2024, 3, 15); // 15 April 2024
    }
}
