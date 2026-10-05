import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { WeekmenuDay } from '../types/weekmenu/weekmenu.type';

@Injectable({
    providedIn: 'root'
})
export class WeekmenuService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    get(): Observable<WeekmenuDay[]> {
        return this._http.get<WeekmenuDay[]>(this._getUrl(`Get`));
    }

    save(weekmenu: WeekmenuDay[]): Observable<void> {
        return this._http.post<void>(this._getUrl('Save'), weekmenu);
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Weekmenu/' + method);
    }
}
