import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight, HighlightType } from '../types/highlight.type';

@Injectable({
    providedIn: 'root'
})
export class HightlightService {
    private readonly _highlights: Highlight[] = [
        {
            title: 'This is a location',
            distance: 5,
            type: HighlightType.other
        },
        {
            title: 'Here you have another place',
            distance: 23,
            type: HighlightType.photos
        },
        {
            title: 'Very beautiful',
            distance: 42,
            type: HighlightType.town
        },
        {
            title: 'Shorty',
            distance: 76,
            type: HighlightType.other
        },
        {
            title: 'A bay',
            distance: 98,
            type: HighlightType.other
        },
        {
            title: 'Very beautiful',
            distance: 100,
            type: HighlightType.other
        },
        {
            title: 'This is a location',
            distance: 123,
            type: HighlightType.other
        },
        {
            title: 'Yosemite National Park',
            distance: 130,
            type: HighlightType.town
        },
        {
            title: 'Very beautiful',
            distance: 143,
            type: HighlightType.other
        },
        {
            title: 'This is a location',
            distance: 150,
            type: HighlightType.other
        },
        {
            title: 'Here you have another place',
            distance: 176,
            type: HighlightType.other
        },
        {
            title: 'Very beautiful',
            distance: 200,
            type: HighlightType.other
        },
        {
            title: 'This is a location',
            distance: 299,
            type: HighlightType.other
        },
        {
            title: 'Here you have another place',
            distance: 309,
            type: HighlightType.other
        },
        {
            title: 'Very beautiful',
            distance: 343,
            type: HighlightType.other
        }
    ];

    getHighlights(): Observable<Highlight[]> {
        return of(this._highlights);
    }
}
