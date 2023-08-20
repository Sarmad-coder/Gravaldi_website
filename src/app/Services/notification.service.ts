import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public url = environment.baseUrl + '/notication/';
  constructor(private http: HttpClient) { }

  create(data): Observable<any> {
    return this.http.post(this.url + 'create', data);
  }

}
