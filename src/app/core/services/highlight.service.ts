import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight, HighlightType } from '../types/highlight.type';

@Injectable({
    providedIn: 'root'
})
export class HightlightService {
    private readonly _highlights: Highlight[] = [
        {
            id: 1,
            title: 'This is a location',
            distance: 5,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 2,
            title: 'Here you have another place',
            distance: 23,
            type: HighlightType.photos,
            currentLocation: false
        },
        {
            id: 3,
            title: 'Very beautiful',
            distance: 42,
            type: HighlightType.town,
            currentLocation: false
        },
        {
            id: 4,
            title: 'Shorty',
            distance: 76,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 5,
            title: 'A bay',
            distance: 98,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 6,
            title: 'Very beautiful',
            distance: 100,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 7,
            title: 'This is a location',
            distance: 123,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 8,
            title: 'Yosemite National Park',
            distance: 130,
            type: HighlightType.town,
            currentLocation: true
        },
        {
            id: 9,
            title: 'Very beautiful',
            distance: 143,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 10,
            title: 'This is a location',
            distance: 150,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 11,
            title: 'You are here',
            distance: 176,
            type: HighlightType.other,
            currentLocation: true
        },
        {
            id: 12,
            title: 'Very beautiful',
            distance: 200,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 13,
            title: 'This is a location',
            distance: 299,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 14,
            title: 'Here you have another place',
            distance: 309,
            type: HighlightType.other,
            currentLocation: false
        },
        {
            id: 15,
            title: 'Very beautiful',
            distance: 343,
            type: HighlightType.other,
            currentLocation: false
        }
    ];

    getHighlights(): Observable<Highlight[]> {
        return of(this._highlights);
    }
}
