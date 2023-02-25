import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight, HighlightContentType, HighlightType } from '../types/highlight.type';

@Injectable({
    providedIn: 'root'
})
export class HightlightService {
    private readonly _highlights: Highlight[] = [
        {
            id: 1,
            title: 'This is something',
            distance: 5,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 2,
            title: 'Here you have another',
            distance: 23,
            type: HighlightType.place,
            contentType: HighlightContentType.photos,
            currentLocation: false,
            children: []
        },
        {
            id: 3,
            title: 'Very beautiful',
            distance: 42,
            type: HighlightType.place,
            contentType: HighlightContentType.town,
            currentLocation: false,
            children: []
        },
        {
            id: 4,
            title: 'Shorty',
            distance: 76,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 5,
            title: 'A bay',
            distance: 98,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 6,
            title: 'Very beautiful',
            distance: 100,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 7,
            title: 'This is something else',
            distance: 123,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 8,
            title: 'Current is current',
            distance: 130,
            type: HighlightType.place,
            contentType: HighlightContentType.town,
            currentLocation: true,
            children: []
        },
        {
            id: 9,
            title: 'Lorem ipsum',
            distance: 143,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 10,
            title: 'A section in scarlet',
            distance: 150,
            type: HighlightType.section,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 11,
            title: 'You are here',
            distance: 176,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: true,
            children: []
        },
        {
            id: 12,
            title: 'Very beautiful',
            distance: 200,
            type: HighlightType.section,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 13,
            title: 'Section perfection',
            distance: 299,
            type: HighlightType.section,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 14,
            title: 'Here you have another place',
            distance: 309,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        },
        {
            id: 15,
            title: 'Very wow',
            distance: 343,
            type: HighlightType.place,
            contentType: HighlightContentType.other,
            currentLocation: false,
            children: []
        }
    ];

    getHighlights(): Observable<Highlight[]> {
        return of(this._highlights);
    }
}
