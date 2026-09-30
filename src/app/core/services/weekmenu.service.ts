import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { Groceries } from '../types/groceries/groceries.type';
import { WeekmenuDay } from '../types/weekmenu/weekmenu.type';

@Injectable({
    providedIn: 'root'
})
export class WeekmenuService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    get(): Observable<WeekmenuDay[]> {
        return this._http.get<WeekmenuDay[]>(this._getUrl(`Get`));
    }

    save(groceries: Groceries): Observable<null> {
        return this._http.post<null>(this._getUrl('Save'), groceries);
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Weekmenu/' + method);
    }
}
