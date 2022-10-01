import { Injectable } from '@angular/core';
import { EnvironmentService } from '../services/environment.service';

export interface QueryStringKeyValuePair {
    key: string;
    value: string | string[];
}

@Injectable({ providedIn: 'root' })
export class UrlBuilderHelper {
    private readonly apiUrlPrefix: string;

    constructor(environmentService: EnvironmentService) {
        this.apiUrlPrefix = environmentService.baseApiUrl;
    }

    constructUrlWithApiUrlPrefix(methodPath: string, queryParameters?: QueryStringKeyValuePair[]): string {
        const queryString = queryParameters && queryParameters.length > 0 ? this._toQueryString(queryParameters) : '';
        return `${this.apiUrlPrefix}${methodPath}${queryString}`;
    }

    private _toQueryString(queryParameters: QueryStringKeyValuePair[]): string {
        return `?${queryParameters.map(this._toQueryParameterString).join('&')}`;
    }

    private _toQueryParameterString(keyValuePair: QueryStringKeyValuePair): string {
        return Array.isArray(keyValuePair.value)
            ? keyValuePair.value.map(value => `${keyValuePair.key}=${value}`).join('&')
            : `${keyValuePair.key}=${keyValuePair.value}`;
    }
}