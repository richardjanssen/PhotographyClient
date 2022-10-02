import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    private _environment = environment;

    get baseApiUrl(): string {
        return this._environment.baseApiUrl;
    }

    get tokenName(): string {
        return this._environment.tokenName;
    }
}
