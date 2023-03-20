import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { Album } from '../types/album.type';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    getAlbums(): Observable<Album[]> {
        return this._http.get<Album[]>(this._getUrl('GetAll'));
    }

    addAlbum(album: Album): Observable<null> {
        return this._http.post<null>(this._getUrl('AddAlbum'), album);
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Album/' + method);
    }
}
