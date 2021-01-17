import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
@Injectable({
    providedIn: 'root'
})

export class CustomerGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.user$.pipe(
            take(1),
            map(user => user && user.roles.customer ? true : false),
            tap(isCustomer => {
                if (!isCustomer) {
                    this.router.navigate(['/error-pages/404']);
                }
            })
        );
    }
}
