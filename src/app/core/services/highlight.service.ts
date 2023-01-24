import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight } from '../types/highlight.type';

@Injectable({
    providedIn: 'root'
})
export class HightlightService {
    private readonly _highlights: Highlight[] = [
        {
            title: 'This is a location'
        },
        {
            title: 'Here you have another place'
        },
        {
            title: 'Very beautiful'
        },
        {
            title: 'This is a location'
        },
        {
            title: 'Here you have another place'
        },
        {
            title: 'Very beautiful'
        },
        {
            title: 'This is a location'
        },
        {
            title: 'Here you have another place'
        },
        {
            title: 'Very beautiful'
        },
        {
            title: 'This is a location'
        },
        {
            title: 'Here you have another place'
        },
        {
            title: 'Very beautiful'
        },
        {
            title: 'This is a location'
        },
        {
            title: 'Here you have another place'
        },
        {
            title: 'Very beautiful'
        }
    ];

    getHighlights(): Observable<Highlight[]> {
        return of(this._highlights);
    }
}
