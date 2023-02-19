import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StyleService {
    get transitionTimeMs(): number {
        return this.getValue(this.getProperty('--transition-time-unitless'));
    }

    private getProperty(property: string): string {
        return getComputedStyle(document.documentElement).getPropertyValue(property);
    }

    private getValue(value: string): number {
        return parseInt(value, 10);
    }
}
