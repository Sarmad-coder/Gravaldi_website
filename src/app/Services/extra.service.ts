import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExtraService {
  
  navBarPosition$ = new Subject();
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) {}

  gteall_extrasByName(data) {
    return this.http.post(this.baseUrl + '/extras/web/extrasBytypes', data)
  }
  gteall_extrasByOrder() {
    return this.http.get(this.baseUrl + '/extras/order/getForOrder')
  }

  extras_types(data) {
    return this.http.post(this.baseUrl + '/extras/web/extras_types', data)
  }

  extrasByTypes(data) {
    return this.http.post(
      this.baseUrl + '/extras/measurement/extrasTypes',
      data,
    )
  }

  sizeType() {
    return this.http.get(this.baseUrl + '/extras/getAll/sizeType')
  }

  Size_defaultValues(id) {
    return this.http.get(this.baseUrl + '/extras/getById/sizeType/' + id)
  }

  getAll_sizeExtras() {
    return this.http.get(this.baseUrl + '/extras/getall/sizeExtras')
  }

  extByid(id) {
    return this.http.get(this.baseUrl + '/extras/extByid/' + id)
  }
}
