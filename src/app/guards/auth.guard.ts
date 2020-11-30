import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { take, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.afAuth.authState
      .pipe(
        take(1),
        map(user => !!user),
        tap(signedIn => {
          if (!signedIn) {
            this.router.navigate(['/login']);
          }
        })
      );
  }
}
