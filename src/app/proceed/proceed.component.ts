import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../environments/environment.prod";
import { OrderService } from '../Services/order.service';
import { ProductsService } from '../Services/products.service';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proceed',
  templateUrl: './proceed.component.html',
  styleUrls: ['./proceed.component.scss']
})
export class ProceedComponent implements OnInit {
  adminId = '60c86200156c8d53bc93c604';
  billingDetails = JSON.parse(localStorage.getItem('billingDetails'));
  cartProducts: any;
  baseUrl = environment.baseUrl;
  finalAmount = 0;
  subtotal = 0;
  shippingAmount = 0;
  todayDate: any;
  isCoupanExist = false;
  invalidFormatte = false;
  orderLoader = false;
  coupanObj = {
    code: ''
  }
  shipping: any;
  getCoupan: any;
  user: any;
  token = '';
  extraData: any;
  invalidError = false;
  paymentObj = {
    cardType: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  }

  orderObj = {
    user: '',
    firstName: '',
    lastName: '',
    orderNumber: '',
    accountOwner: this.adminId,
    product: '',
    unitPrice: '',
    accountNumber: '',
    productType: '',
    delivery: '', // ye bhi ni aye ga
    invoiceStatus: '',
    stage: '',
    collar: '',
    collarContrast: '',
    cuffs: '',
    cuffsContrast: '',
    collarcuffstitching: '',
    placket: '',
    back: '',
    pocket: '',
    monogram: '',
    initial: '',
    style: '0',
    color: '',
    shirtFit: '',
    shirtLength: '',
    innerContrast: '',
    button: '',
    buttonThread: '0',
    comissionStatus: '',
    contrastFabric: '',
    placement: '',
    interlining: '',
    bottomStyle: '',
    totalPrice: 0,
    modifiedBy: null,
    createdBy: null,
    brand: '', // ye bhi ni aye ga
    measurement: null,
    price: 0,
    quantity: '',
    orderType: '',
    isfree: false,
    advancePayment: '0',
    fields: [],
    coupan: null,
    fromweb: true,
    billingaddress: '',
    billingdetail: '',
    stripeObj: {
      amount: 0,
      currency: 'usd',
      source: '',
      description: 'Thanks for Order.'
    }
  }

  // payment method
  handler: any = null;

  constructor(
    private prodSrv: ProductsService,
    private ordSrv: OrderService,
    private toster: ToastrService,
    public datepipe: DatePipe,
    private userSrv: UserService,
    private router: Router,
  ) {
    this.loadStripe();
  }

  pay() {

    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_live_eqgpLuCgwB1mn0qjduHrIA7V',
      // key: 'pk_test_51MKfXjJRymQrzkHidtZSk5P969L7Xqp4TKmAba8XG4uIHoiDXFpt1lPJC4pUzNWkW69SaIXYJ1RVhEH7S38opezH00z1GUFA4O',

      locale: 'auto',
      token: function (resp: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        this.orderObj.stripeObj.source = resp.id;
        this.submit();
        // alert('Token Created!!');
      }
    });

    handler.open({
      name: 'Gravaldi',
      description: 'Online payment processing for internet businesses',
      amount: 0
    });

  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_live_eqgpLuCgwB1mn0qjduHrIA7V',
          // key: 'pk_test_51MKfXjJRymQrzkHidtZSk5P969L7Xqp4TKmAba8XG4uIHoiDXFpt1lPJC4pUzNWkW69SaIXYJ1RVhEH7S38opezH00z1GUFA4O',

          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            // alert('Payment Success!!');
          }
        });
      }
      window.document.body.appendChild(s);
    }
  }

  ngOnInit() {
    this.localCartPreoducts();
    this.todayDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    let payment = JSON.parse(localStorage.getItem('paymentObj'));
    if (payment) {
      this.paymentObj.name = payment.name;
      this.paymentObj.cardType = payment.cardType;
      this.paymentObj.cardNumber = payment.cardNumber;
      this.paymentObj.cvv = payment.cvv;
      this.paymentObj.expiryDate = payment.expiryDate;
    }
  }

  localCartPreoducts() {
    var getCart = JSON.parse(localStorage.getItem('cart'));
    if (getCart) {
      this.prodSrv.getProductsByIds(getCart).subscribe((resp: any) => {
        this.cartProducts = resp.data;
        this.summary(this.cartProducts);
        this.getCoupanfromLocal();
      })
    }
  }

  summary(data) {
    this.finalAmount = 0;
    console.log(data);
    for (let index = 0; index < data.length; index++) {
      if (data[index].price != null) {
        this.finalAmount += (data[index].price+ (data[index].size.monogram == true ? 10 :0))* data[index].qty;
        this.subtotal += (data[index].price+ (data[index].size.monogram == true ? 10 :0))* data[index].qty;;
      }
    }
  }

  addMongogramPrice(item) {
    return (item.price + (item.size.monogram == true ? 10 :0)) * item.qty;
  }

  getCoupanfromLocal() {
    var cp = JSON.parse(localStorage.getItem('coupan'));
    if (cp) {
      this.getCoupan = cp
      this.coupanObj.code = cp.code;
      this.isCoupanExist = true;
      if (cp.discountIs == 'Percentage') {
        const percentageOff = (
          price: number,
          percentageValue: number
        ): number => {
          return price * (1 - percentageValue / 100)
        }
        var final = percentageOff(this.finalAmount, cp.discount)
        this.finalAmount = final;
      } else {
        let am = this.finalAmount - cp.discount;
        this.finalAmount = am;
      }
    }
  }

  deleteCoupan() {
    localStorage.removeItem('coupan');
    this.coupanObj.code = '';
    this.isCoupanExist = false;
    this.summary(this.cartProducts)
  }

  toast(message, status, time) {
    if (status == 'success') {
      this.toster.success(message, '', {
        timeOut: time,
        positionClass: 'toast-bottom-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else if (status == 'error') {
      this.toster.error(message, '', {
        timeOut: time,
        positionClass: 'toast-bottom-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    }
  }

  submit() {
    this.orderLoader = true;
    this.orderObj.fields = [];
    for (const key in this.paymentObj) {
      if (Object.prototype.hasOwnProperty.call(this.paymentObj, key)) {
        if (this.paymentObj[key] == '') {
          this.invalidFormatte = true;
          break;
        } else {
          this.invalidFormatte = false;
        }
      }
    }
    if (!this.invalidFormatte) {
      localStorage.setItem('paymentObj', JSON.stringify(this.paymentObj));
      var user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        this.toast('Please loggedIn required', 'error', 3000);
        this.orderLoader = false;
      } else {
        var coup = JSON.parse(localStorage.getItem('coupan'));
        var billingDetails = JSON.parse(localStorage.getItem('billingDetails'));
        var measurement = JSON.parse(localStorage.getItem('productSizes'));;
        let fields = JSON.parse(localStorage.getItem('cart'));
        for (let i = 0; i < fields.length; i++) {
          var x = measurement.findIndex(item => item.productId == fields[i].id);
          let y = x != -1 ? measurement[x].measurement : null;
          this.orderObj.fields.push({
            id: fields[i].id,
            info: fields[i].info,
            qty: fields[i].qty,
            size: fields[i].size,
            measurement: y
          })
        }

        this.orderObj.user = user._id;
        this.orderObj.createdBy = user._id;
        this.orderObj.modifiedBy = user._id;
        this.orderObj.firstName = user.username;
        this.orderObj.coupan = coup != null ? coup._id : null;
        this.orderObj.billingaddress = billingDetails;
        this.orderLoader = false;
        this.orderObj.stripeObj.amount = this.finalAmount;
        this.ordSrv.createOrder(this.orderObj).subscribe((resp: any) => {
          if (resp.message == 'success') {
            this.toast('Order created successfully', 'success', 3000);
            localStorage.removeItem('productSizes');
            localStorage.removeItem('billingDetails');
            localStorage.removeItem('coupan');
            localStorage.removeItem('cart');
            localStorage.removeItem('paymentObj');
            localStorage.removeItem('productInfo');
            this.router.navigate(['/home']);
            this.prodSrv.cartItems = 0;
          } else if (resp.message == 'Quantity is larger then current') {
            this.toast('Quantity is larger then current', 'error', 3000);
          } else {
            console.log('something went wrong')
          }
          this.orderLoader = false;
        })
      }
    }
  }

}
