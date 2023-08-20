import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  public url = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.url + '/country/getall');
  }

  getById(countryId): Observable<any> {
    return this.http.get(this.url + '/country/' + countryId);
  }

  getallByCountryName(countryName) {
    return this.http.get(this.url + '/provinces/getallByCountryName/' + countryName);
  }

  getallByProvinceName(provinceName) {
    return this.http.get(this.url + '/city/getallByProvinceName/' + provinceName);
  }
}
