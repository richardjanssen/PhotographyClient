import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private readonly _authenticationService: AuthenticationService, private readonly _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): boolean | Promise<boolean> {
        const isLoggedIn = this._authenticationService.isLoggedIn();
        if (!isLoggedIn) {
            this._router.navigate(['/login']);
            return false;
        }

        const roles = route.data['roles'] as string[];
        if (roles.length === 0) {
            return true;
        }

        if (!this._authenticationService.isAuthorizedForRoles(roles)) {
            this._router.navigate(['/unauthorized']);
            return false;
        }

        return true;
    }
}
