import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { tap, catchError, finalize, take, takeUntil } from 'rxjs/operators';
import { UserDto, LoginRequest, AuthResponse, RefreshTokenRequest } from '../types/account.type';
import { UrlBuilderHelper } from '../helpers/url-builder.helper';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {
    private readonly TOKEN_KEY = 'accessToken';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private readonly USER_KEY = 'user';

    readonly errors: string[] = [];
    // State management
    private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Token refresh management
    private refreshTokenInProgress = false;
    private refreshTokenSubject = new Subject<string>();
    private refreshTokenCompleted$ = this.refreshTokenSubject.asObservable();

    // Cleanup
    private destroy$ = new Subject<void>();

    // Configuration
    private readonly TOKEN_REFRESH_THRESHOLD_MS = 60000; // Refresh 1 minute before expiry
    private refreshTokenTimer: number | null;

    constructor(private http: HttpClient, private readonly _urlBuilderHelper: UrlBuilderHelper) {
        // Initialize authentication from stored tokens and set up auto-refresh
        const token = this.getAccessToken();
        const user = this.getUserFromStorage();

        if (token && this.isTokenValid(token)) {
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            this.scheduleTokenRefresh(token);
        } else if (token && this.isTokenExpired(token)) {
            // Token is expired, try to refresh it
            this.attemptSilentRefresh();
        } else {
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
        }
    }

    ngOnDestroy(): void {
        this.clearTokenRefreshTimer();
        this.destroy$.next();
        this.destroy$.complete();
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this._getUrl('Login'), request).pipe(
            tap(response => {
                if (response.success && response.accessToken && response.refreshToken) {
                    this.setTokensAndUserInStorage(response.accessToken, response.refreshToken, response.user);
                    this.currentUserSubject.next(response.user);
                    this.isAuthenticatedSubject.next(true);
                    this.scheduleTokenRefresh(response.accessToken);
                }
            }),
            catchError(error => this.handleError(error))
        );
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logout(): Observable<any> {
        const refreshToken = this.getRefreshToken();

        // Optionally notify backend to revoke token
        const logout$ = refreshToken
            ? this.http.post(this._getUrl('Logout'), {}).pipe(
                  catchError(error => {
                        this.handleErrorWithoutRethrow(error);
                      // Continue logout even if request fails
                      return of({});
                  })
              )
            : of({});

        return logout$.pipe(
            finalize(() => {
                this.clearAuthState();
                this.clearTokenRefreshTimer();
            })
        );
    }

    refreshAccessToken(): Observable<AuthResponse> {
        // Prevent multiple simultaneous refresh requests
        if (this.refreshTokenInProgress) {
            return new Observable(observer => {
                this.refreshTokenCompleted$.pipe(take(1), takeUntil(this.destroy$)).subscribe({
                    next: newToken => {
                        observer.next({ accessToken: newToken } as AuthResponse);
                        observer.complete();
                    },
                    error: err => {
                        this.handleErrorWithoutRethrow(err);
                        return observer.error(err);
                    }
                });
            });
        }

        this.refreshTokenInProgress = true;

        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            this.clearAuthState();
            this.refreshTokenInProgress = false;
            this.errors.push('No refresh token available')
            return throwError(() => new Error('No refresh token available'));
        }

        const request: RefreshTokenRequest = { refreshToken };

        return this.http.post<AuthResponse>(this._getUrl('Refresh'), request).pipe(
            tap(response => {
                if (response.success && response.accessToken && response.refreshToken) {
                    this.setTokensAndUserInStorage(response.accessToken, response.refreshToken, response.user);
                    this.currentUserSubject.next(response.user);
                    this.isAuthenticatedSubject.next(true);
                    this.scheduleTokenRefresh(response.accessToken);

                    // Notify waiting requests
                    this.refreshTokenSubject.next(response.accessToken);
                }
            }),
            catchError(error => {
                this.clearAuthState();
                return this.handleError(error);
                // return throwError(() => error);
            }),
            finalize(() => {
                this.refreshTokenInProgress = false;
            })
        );
    }

    isTokenExpired(token: string): boolean {
        return !this.isTokenValid(token);
    }

    getCurrentUser(): UserDto | null {
        return this.currentUserSubject.value;
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.roles?.includes(role) ?? false;
    }

    hasAnyRole(roles: string[]): boolean {
        return roles.some(role => this.hasRole(role));
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decodeToken(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            this.errors.push('Invalid token format');
            throw new Error('Invalid token format');
        }
    }

    private attemptSilentRefresh(): void {
        this.refreshAccessToken()
            .pipe(
                take(1),
                catchError(error => {
                    this.handleErrorWithoutRethrow(error);
                    this.clearAuthState();
                    return of(null);
                })
            )
            .subscribe();
    }

    private scheduleTokenRefresh(token: string): void {
        this.clearTokenRefreshTimer();

        const expirationTime = this.getTokenExpirationTime(token);

        if (!expirationTime) {
            return;
        }

        const now = Date.now();
        const timeUntilExpiry = expirationTime - now;
        const refreshTime = Math.max(0, timeUntilExpiry - this.TOKEN_REFRESH_THRESHOLD_MS);

        if (refreshTime > 0) {
            this.refreshTokenTimer = setTimeout(() => {
                this.refreshAccessToken()
                    .pipe(
                        take(1),
                        catchError(error => {
                            this.handleErrorWithoutRethrow(error);
                            this.clearAuthState();
                            return of(null);
                        })
                    )
                    .subscribe();
            }, refreshTime);
        }
    }

    private clearTokenRefreshTimer(): void {
        if (this.refreshTokenTimer) {
            clearTimeout(this.refreshTokenTimer);
            this.refreshTokenTimer = null;
        }
    }

    private getTokenExpirationTime(token: string): number | null {
        try {
            const decoded = this.decodeToken(token);
            if (decoded && decoded.exp) {
                return decoded.exp * 1000; // Convert to milliseconds
            }
        } catch (error) {
            this.errors.push(`Error decoding token: ${error}`)
            console.error('Error decoding token:', error);
        }
        return null;
    }

    

    private isTokenValid(token: string): boolean {
        try {
            const expirationTime = this.getTokenExpirationTime(token);
            return !!expirationTime && expirationTime > Date.now();
        } catch {
            return false;
        }
    }

    private setTokensAndUserInStorage(accessToken: string, refreshToken: string, user: UserDto): void {
        localStorage.setItem(this.TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }

    private getUserFromStorage(): UserDto | null {
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    private clearAuthState(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.clearTokenRefreshTimer();
    }


    private handleErrorWithoutRethrow(error: HttpErrorResponse): void {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error(errorMessage);
        this.errors.push(errorMessage);
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error(errorMessage);
        this.errors.push(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    private _getUrl(method: string): string {
        return this._urlBuilderHelper.constructUrlWithApiUrlPrefix('v1/Authentication/' + method);
    }
}
