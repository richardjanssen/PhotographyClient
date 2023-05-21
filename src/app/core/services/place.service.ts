import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HttpClient } from '@angular/common/http';
import { Place } from '../types/place.type';

@Injectable({
    providedIn: 'root'
})
export class PlaceService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    getAll(): Observable<Place[]> {
        return of([
            { distance: 12.5, title: 'An example place' },
            { distance: 14.2, title: 'Second place' }
        ]);
        return this._http.get<Place[]>(this._getUrl('GetAll'));
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Place/' + method);
    }
}
