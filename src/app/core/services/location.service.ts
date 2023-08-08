import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Coordinate, UserLocation } from '../types/location.type';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    addManual(placeId: number): Observable<null> {
        return this._http.post<null>(this._getUrl('AddManual'), { placeId });
    }

    getAll(): Observable<UserLocation[]> {
        return this._http.get<UserLocation[]>(this._getUrl('GetAll'));
    }

    getCoordinateById(id: number): Observable<Coordinate | null> {
        return of({
            lat: 32.590243,
            lon: -116.467459
        });
        // return this._http.get<Coordinate>(this._getUrl(`GetCoordinateById?id=${id}`));
    }

    delete(id: number): Observable<null> {
        return this._http.delete<null>(this._getUrl('Delete'), { params: new HttpParams().set('id', id) });
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Location/' + method);
    }
}
