import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { Groceries } from '../types/groceries/groceries.type';

@Injectable({
    providedIn: 'root'
})
export class GroceriesService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    get(): Observable<Groceries> {
        return this._http.get<Groceries>(this._getUrl(`Get`));
    }

    save(groceries: Groceries): Observable<null> {
        return this._http.post<null>(this._getUrl('Save'), groceries);
    }

    add(names: string[]): Observable<null> {
        // TODO: methode implementeren
        console.log(names);
        return of(null);
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Groceries/' + method);
    }
}
