import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { Recipe } from '../types/recipe/recipe.type';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    constructor(private readonly _urlBuilderHelper: UrlBuilderHelper, private readonly _http: HttpClient) {}

    add(update: Recipe): Observable<null> {
        return this._http.post<null>(this._getUrl('Add'), update);
    }

    update(update: Recipe): Observable<null> {
        // Not implemented yet
        return this._http.put<null>(this._getUrl('Update'), update);
    }

    getRecipe(id: number): Observable<Recipe | null> {
        // Not implemented yet
        return this._http.get<Recipe | null>(this._getUrl(`GetById?id=${id}`));
    }

    getAll(): Observable<Recipe[]> {
        return this._http.get<Recipe[]>(this._getUrl('GetAll'));
    }

    delete(id: number): Observable<null> {
        // Not implemented yet
        return this._http.delete<null>(this._getUrl('Delete'), { params: new HttpParams().set('id', id) });
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Recipe/' + method);
    }
}
