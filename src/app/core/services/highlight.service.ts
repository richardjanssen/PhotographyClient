import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight, HighlightContentType, HighlightType } from '../types/highlight.type';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HttpClient } from '@angular/common/http';

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
                                title: 'An update with a long name so more lines'
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
                                title: 'A beautiful town'
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
        },
        {
            type: HighlightType.section,
            sectionHighlight: {
                highlightIndex: 3,
                title: 'A second section',
                children: [
                    {
                        highlightIndex: 0,
                        distance: 143,
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
                        distance: 150.3,
                        currentLocation: false,
                        points: [
                            {
                                id: 2,
                                placeType: HighlightContentType.town,
                                title: 'A beautiful place in a section put with a very long title so what do we do now?'
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
                        distance: 176.5,
                        currentLocation: false,
                        points: [
                            {
                                id: 4,
                                placeType: HighlightContentType.photo,
                                title: 'Mooi hier'
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
                distance: 201,
                currentLocation: false,
                points: [
                    {
                        id: 3,
                        placeType: HighlightContentType.blog,
                        title: 'Een update van mij'
                    }
                ]
            }
        }
    ];

    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    getHighlights(): Observable<Highlight[]> {
        return of(this._highlights);
        // return this._http.get<Highlight[]>(this._getUrl('GetAll'));
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Highlight/' + method);
    }
}
