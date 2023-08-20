import { Injectable } from '@angular/core';
import { CanActivate,  ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompGuard implements CanActivate {
  user = JSON.parse(localStorage.getItem('user'));

  constructor(
    private _router: Router
  ) { }
  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      this._router.navigate(['/']);
      return false
    }
  }
}
