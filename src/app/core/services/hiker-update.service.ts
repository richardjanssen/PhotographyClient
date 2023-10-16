import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HikerUpdate, HikerUpdateBasic, HikerUpdateDetails } from '../types/hiker-update.type';

@Injectable({
    providedIn: 'root'
})
export class HikerUpdateService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    add(update: HikerUpdate): Observable<null> {
        return this._http.post<null>(this._getUrl('Add'), update);
    }

    update(update: HikerUpdate): Observable<null> {
        return this._http.put<null>(this._getUrl('Update'), update);
    }

    getUpdate(id: number): Observable<HikerUpdate | null> {
        return this._http.get<HikerUpdate | null>(this._getUrl(`GetById?id=${id}`));
    }

    getUpdateDetails(id: number): Observable<HikerUpdateDetails> {
        return this._http.get<HikerUpdateDetails>(this._getUrl(`GetDetailsById?id=${id}`));
    }

    getAll(): Observable<HikerUpdateBasic[]> {
        return this._http.get<HikerUpdateBasic[]>(this._getUrl('GetAll'));
    }

    delete(id: number): Observable<null> {
        return this._http.delete<null>(this._getUrl('Delete'), { params: new HttpParams().set('id', id) });
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/HikerUpdate/' + method);
    }

    private _getPhotosUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Photos/' + method);
    }
}
