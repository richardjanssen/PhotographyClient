import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';
import { Account } from '../types/account.type';
import { EnvironmentService } from './environment.service';
import { SessionStorageService } from './session-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private readonly _sessionStorageService: SessionStorageService,
        private readonly _jwtHelperService: JwtHelperService,
        private readonly _environmentService: EnvironmentService,
        private readonly _http: HttpClient,
        private readonly _router: Router,
        private readonly _urlBuilderHelper: UrlBuilderHelper
    ) {}

    isLoggedIn(): boolean {
        const token = this._sessionStorageService.getItem(this._environmentService.tokenName);

        if (token == null) {
            this.isLoggedIn$.next(false);
            return false;
        }

        const decodedToken = this._jwtHelperService.decodeToken(token);
        if (decodedToken.exp > Date.now() / 1000) {
            this.isLoggedIn$.next(true);
            return true;
        }

        this.isLoggedIn$.next(false);
        return false;
    }

    isAuthorizedForRoles(roles: string | string[]): boolean {
        const token = this._sessionStorageService.getItem(this._environmentService.tokenName);

        if (!token) {
            return false;
        }

        const decodedToken = this._jwtHelperService.decodeToken(token);
        return [...roles].some(requiredRole => decodedToken.role.some((tokenRole: string) => requiredRole === tokenRole));
    }

    logout(): void {
        this._sessionStorageService.removeItem(this._environmentService.tokenName);
        this.isLoggedIn$.next(false);
        this._router.navigateByUrl('/login');
    }

    login(userName: string, password: string): void {
        this._http.post<string | null>(this._getUrl('VerifyAccount'), this._getAccount(userName, password)).subscribe(token => {
            if (token === null) {
                return;
            }
            this._sessionStorageService.setItem(this._environmentService.tokenName, token);
            this._router.navigateByUrl('/admin');
            this.isLoggedIn$.next(true);
        });
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Authentication/' + method);
    }

    private _getAccount(userName: string, password: string): Account {
        return { userName, password };
    }
}
