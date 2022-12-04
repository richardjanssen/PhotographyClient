import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { Photo } from '../types/photo.type';

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    getPhotos(): Observable<Photo[]> {
        return this._http.get<Photo[]>(this._getUrl('Get'));
    }

    uploadPhoto(photo: FormData): Observable<HttpEvent<Photo>> {
        return this._http.post<Photo>(this._getUrl('UploadPhoto'), photo, { reportProgress: true, observe: 'events' });
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Photos/' + method);
    }
}
