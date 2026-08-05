import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip token injection for login and refresh endpoints
    if (this.shouldSkipTokenInjection(request)) {
      return next.handle(request);
    }

    // Add access token to request
    const token = this.authenticationService.getAccessToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        // Handle 401 responses by attempting token refresh
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Add access token to request headers
   */
  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Handle 401 errors by refreshing token and retrying request
   */
  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Prevent multiple simultaneous refresh attempts
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authenticationService.refreshAccessToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          const newToken = response.accessToken;
          this.refreshTokenSubject.next(newToken);

          // Retry original request with new token
          return next.handle(this.addToken(request, newToken));
        }),
        catchError(error => {
          this.isRefreshing = false;
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }

    // If refresh is already in progress, wait for it to complete
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        return next.handle(this.addToken(request, token!));
      })
    );
  }

  private shouldSkipTokenInjection(request: HttpRequest<unknown>): boolean {
    return (
      request.url.includes('/Authentication/Login') ||
      request.url.includes('/Authentication/Refresh') ||
      request.url.includes('/Authentication/Logout')
    );
  }
}
