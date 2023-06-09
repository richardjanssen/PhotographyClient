import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HikerUpdate, HikerUpdateDetails } from '../types/hiker-update.type';
import { Photo } from '../types/photo.type';

@Injectable({
    providedIn: 'root'
})
export class HikerUpdateService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    addUpdate(update: HikerUpdate): Observable<null> {
        return this._http.post<null>(this._getUrl('AddHikerUpdate'), update);
    }

    getUpdate(id: number): Observable<HikerUpdateDetails> {
        // return this._http.get<HikerUpdateDetails>(this._getUrl(`GetById?id=${id}`));

        // This is a temporary function to get some meaningful content from a hiker update.
        return this._http
            .get<Photo[]>(this._getPhotosUrl('Get'))
            .pipe(map(photos => ({ text: 'Dit is een stukje tekst bij een fotoalbum of een blog', album: { photos } })));
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/HikerUpdate/' + method);
    }

    private _getPhotosUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Photos/' + method);
    }
}
