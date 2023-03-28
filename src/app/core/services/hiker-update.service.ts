import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HikerUpdate } from '../types/hiker-update.type';

@Injectable({
    providedIn: 'root'
})
export class HikerUpdateService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    addUpdate(update: HikerUpdate): Observable<null> {
        return this._http.post<null>(this._getUrl('AddHikerUpdate'), update);
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/HikerUpdate/' + method);
    }
}
