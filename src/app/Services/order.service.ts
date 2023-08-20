import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ) { }

  getMeasurByNumber(id) {
    return this.http.get(this.baseUrl + '/measurement/ByNumber/' +id);
  }
  checkCoupanBycode(data) {
    return this.http.post(this.baseUrl + '/coupan/checkCoupanBycode', data);
  }

  coupanById(id) {
    return this.http.get(this.baseUrl + '/coupan/' + id);
  }

  createOrder(data) {
    return this.http.post(this.baseUrl + '/web-order/create', data);
  }

  orderRating(data) {
    return this.http.post(this.baseUrl + '/web-order/rating', data);
  }

  allOrders(id) {
    return this.http.get(this.baseUrl + '/web-order/account/all/' + id);
  }

  pendingOrders(id) {
    return this.http.get(this.baseUrl + '/web-order/account/pending/' + id);
  }

  paidOrders(id) {
    return this.http.get(this.baseUrl + '/web-order/account/paid/' + id);
  }

  deletedOrders(id) {
    return this.http.get(this.baseUrl + '/web-order/account/deleted/' + id);
  }

  singleOrder(id) {
    return this.http.get(this.baseUrl + '/web-order/orderyId/' + id);
  }
  userBillingDetails(id) {
    return this.http.get(this.baseUrl + '/web-order/account/getBillingDetails/' + id);
  }
  refundOrder(data) {
    return this.http.post(this.baseUrl + '/web-order/refund', data);
  }

  extGetForweb() {
    return this.http.get(this.baseUrl + '/extras/order/getForweb');
  }
}
