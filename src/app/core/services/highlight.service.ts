import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Highlight } from '../types/highlight.type';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HightlightService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    getHighlights(): Observable<Highlight[]> {
        return this._http.get<Highlight[]>(this._getUrl('GetAll'));
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Highlight/' + method);
    }
}
