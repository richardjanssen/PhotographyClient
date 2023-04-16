import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight, HighlightContentType, HighlightType } from '../types/highlight.type';

@Injectable({
    providedIn: 'root'
})
export class HightlightService {
    private readonly _highlights: Highlight[] = [
        {
            type: HighlightType.place,
            sectionHighlight: null,
            pointHighlight: {
                highlightIndex: 0,
                distance: 2.5,
                currentLocation: false,
                points: [
                    {
                        id: 1,
                        placeType: HighlightContentType.town,
                        title: 'A beautiful place'
                    }
                ]
            }
        },
        {
            type: HighlightType.section,
            sectionHighlight: {
                highlightIndex: 1,
                title: 'A beautiful section',
                children: [
                    {
                        highlightIndex: 0,
                        distance: 12.3,
                        currentLocation: false,
                        points: [
                            {
                                id: 1,
                                placeType: HighlightContentType.photo,
                                title: 'An update'
                            }
                        ]
                    },
                    {
                        highlightIndex: 1,
                        distance: 14.8,
                        currentLocation: true,
                        points: [
                            {
                                id: 2,
                                placeType: HighlightContentType.town,
                                title: 'A beautiful place in a section'
                            },
                            {
                                id: null,
                                placeType: HighlightContentType.location,
                                title: 'Current location'
                            }
                        ]
                    },
                    {
                        highlightIndex: 2,
                        distance: 30,
                        currentLocation: false,
                        points: [
                            {
                                id: 4,
                                placeType: HighlightContentType.photo,
                                title: 'Mooi hier'
                            }
                        ]
                    },
                    {
                        highlightIndex: 3,
                        distance: 43,
                        currentLocation: false,
                        points: [
                            {
                                id: 2,
                                placeType: HighlightContentType.blog,
                                title: 'string'
                            }
                        ]
                    }
                ]
            },
            pointHighlight: null
        },
        {
            type: HighlightType.place,
            sectionHighlight: null,
            pointHighlight: {
                highlightIndex: 2,
                distance: 100,
                currentLocation: false,
                points: [
                    {
                        id: 3,
                        placeType: HighlightContentType.blog,
                        title: 'Een update van mij'
                    },
                    {
                        id: 5,
                        placeType: HighlightContentType.photo,
                        title: 'Een berichtje op 100 km'
                    }
                ]
            }
        }
    ];

    getHighlights(): Observable<Highlight[]> {
        return of(this._highlights);
    }
}
