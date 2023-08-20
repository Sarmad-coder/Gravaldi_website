import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from '../../Services/order.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  _id: any;
  orders = [];
  order: any;
  baseUrl = environment.baseUrl;
  subtotal = 0;
  constructor(
    private active_route: ActivatedRoute,
    private orderSrv: OrderService
  ) {
    this._id = this.active_route.snapshot.params.id
  }

  ngOnInit() {
    this.orderSrv.singleOrder(this._id).subscribe((resp: any) => {
      console.log(resp)
      this.order = resp.data;
      this.orders.push(resp.data);
    })
  }

}
