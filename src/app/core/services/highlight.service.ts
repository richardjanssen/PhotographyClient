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
                id: 1,
                date: new Date(2023, 7, 24, 12, 10),
                distance: 123,
                isManual: false,
                title: 'A beautiful place',
                placeType: HighlightContentType.town
            }
        },
        {
            type: HighlightType.section,
            sectionHighlight: {
                highlightIndex: 1,
                title: 'A beautiful section',
                children: [
                    {
                        id: 1,
                        date: new Date(2023, 7, 23, 14, 15),
                        distance: 98,
                        isManual: true,
                        title: 'An update with a long name so more lines',
                        placeType: HighlightContentType.photo
                    },
                    {
                        id: 1,
                        date: new Date(2023, 7, 22, 12, 10),
                        distance: 87,
                        isManual: false,
                        title: 'A beautiful town',
                        placeType: HighlightContentType.town
                    },
                    {
                        id: 4,
                        date: new Date(2023, 7, 22, 10, 15),
                        distance: 70,
                        isManual: true,
                        title: 'Mooi hier',
                        placeType: HighlightContentType.photo
                    }
                ]
            },
            pointHighlight: null
        },
        {
            type: HighlightType.place,
            sectionHighlight: null,
            pointHighlight: {
                id: 3,
                date: new Date(2023, 7, 20, 14, 15),
                distance: 45,
                isManual: true,
                title: 'Een update van mij',
                placeType: HighlightContentType.blog
            }
        },
        {
            type: HighlightType.section,
            sectionHighlight: {
                highlightIndex: 3,
                title: 'A second section',
                children: [
                    {
                        id: 1,
                        date: new Date(2023, 7, 19, 14, 15),
                        distance: 40,
                        isManual: true,
                        title: 'Een update met heule mooie fotootjes',
                        placeType: HighlightContentType.photo
                    },
                    {
                        id: 2,
                        date: new Date(2023, 7, 17, 12, 10),
                        distance: 22,
                        isManual: false,
                        title: 'A beautiful town',
                        placeType: HighlightContentType.town
                    }
                ]
            },
            pointHighlight: null
        },
        {
            type: HighlightType.place,
            sectionHighlight: null,
            pointHighlight: {
                id: 3,
                date: new Date(2023, 7, 16, 14, 15),
                distance: 12,
                isManual: true,
                title: 'Een update van mij',
                placeType: HighlightContentType.blog
            }
        }
    ];

    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    getHighlights(): Observable<Highlight[]> {
        // return this._http.get<Highlight[]>(this._getUrl('GetAll'));

        // This is a temporary function to get some meaningful content.
        return of(this._highlights);
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Highlight/' + method);
    }
}
