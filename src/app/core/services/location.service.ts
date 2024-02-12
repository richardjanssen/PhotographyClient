import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MapLocations, UserLocation } from '../types/location.type';

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

    getMapLocationsById(id: number): Observable<MapLocations> {
        return this._http.get<MapLocations>(this._getUrl(`GetMapLocationsById?id=${id}`));
    }

    delete(id: number): Observable<null> {
        return this._http.delete<null>(this._getUrl('Delete'), { params: new HttpParams().set('id', id) });
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Location/' + method);
    }
}
