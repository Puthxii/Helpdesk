import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private afAuth: AngularFireAuth, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.auth.isSignedIn
      .pipe(
        take(1),
        map((isSignedIn: boolean) => {
          if (!isSignedIn) {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        })
      );
  }
}
