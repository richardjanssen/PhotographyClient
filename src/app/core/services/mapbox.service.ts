import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';

@Injectable({
    providedIn: 'root'
})
export class MapboxService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    getPublicToken(): Observable<string> {
        return this._http.get<string>(this._getUrl('GetPublicToken?application=riesj'));
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Mapbox/' + method);
    }
}
