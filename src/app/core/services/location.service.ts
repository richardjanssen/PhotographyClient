import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    addManual(distance: number): Observable<null> {
        return this._http.post<null>(this._getUrl('AddManual'), { distance });
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Location/' + method);
    }
}
