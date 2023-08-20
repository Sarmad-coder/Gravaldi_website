import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url = environment.baseUrl + '/website/account/';

  constructor(private http: HttpClient) { }

  singup(data): Observable<any> {
    return this.http.post(this.url + 'create', data);
  }

  signin(data): Observable<any> {
    return this.http.post(this.url + 'signin', data);
  }

  getById(id): Observable<any> {
    return this.http.get(this.url + id);
  }

  updateAccount(data): Observable<any> {
    return this.http.post(this.url + 'update', data);
  }

  updatePassword(data): Observable<any> {
    return this.http.post(this.url + 'updatePassword', data);
  }

  deleteAccount(userId): Observable<any> {
    return this.http.delete(this.url + userId);
  }

  byshop(): Observable<any> {
    return this.http.get(environment.baseUrl +'/web-settings/Byshop');
  }

  contactUs(data): Observable<any> {
    return this.http.post(environment.baseUrl + '/contact/create', data);
  }

}
