import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../types/settings.types';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    get(): Observable<Settings> {
        return this._http.get<Settings>(this._getUrl('Get'));
    }

    update(settings: Settings): Observable<null> {
        return this._http.put<null>(this._getUrl('Update'), settings);
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Settings/' + method);
    }
}
