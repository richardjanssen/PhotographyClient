
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(route, state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(route, state.url);
  }

  private checkAuth(route: ActivatedRouteSnapshot, url: string): boolean | UrlTree {
    const token = this.authenticationService.getAccessToken();

    // Check if token exists and is valid
    if (!token || this.authenticationService.isTokenExpired(token)) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
      return false;
    }

    // Check for required roles
    const requiredRoles: string[] = route.data['roles'];
    console.log(requiredRoles);
    console.log(this.authenticationService.getCurrentUser());
    if (requiredRoles && requiredRoles.length > 0) {
      if (this.authenticationService.hasAnyRole(requiredRoles)) {
        return true;
      }

      // User lacks required role
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}