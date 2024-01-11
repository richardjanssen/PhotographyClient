import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';
import { EnvironmentService } from '../services/environment.service';
import { SessionStorageService } from '../services/session-storage.service';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
    constructor(private _sessionStorageService: SessionStorageService, private readonly _environmentService: EnvironmentService) {}

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.addToken(request).pipe(
            first(),
            mergeMap((requestWithToken: HttpRequest<unknown>) => next.handle(requestWithToken))
        );
    }

    private addToken(request: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
        const token = this._sessionStorageService.getItem(this._environmentService.tokenName);

        if (token) {
            request = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`),
                withCredentials: true
            });
        }

        return of(request);
    }
}
