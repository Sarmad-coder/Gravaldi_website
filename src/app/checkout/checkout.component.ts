import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment.prod";
import { OrderService } from "../Services/order.service";
import { ProductsService } from "../Services/products.service";
import { UserService } from "../Services/user.service";
import { CountryService } from "../Services/country.service";
import { Router } from "@angular/router";
import { AppService } from "../app.service";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { ExtraService } from "../Services/extra.service";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { StripeScriptTag } from "stripe-angular"

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: "300",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "18px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
    classes: { base: "form-control" },
  };
  elementsOptions: StripeElementsOptions = {
    locale: "en",
  };
  stripeTest: FormGroup;

  adminId = "60c86200156c8d53bc93c604";
  selectedMenu = "ACCOUNT DETAILS";
  orderType = "All Orders";
  cartProducts: any;
  baseUrl = environment.baseUrl;
  finalAmount: any = 0;
  subtotal: any = 0;
  shippingAmount: any = 0;
  todayDate: any;
  isCoupanExist = false;
  getCoupan: any;
  user: any;
  countries: any;
  invalidFormatte = false;
  loader = false;
  handler: any = null;
  orderLoader = false;
  abletoReview = false;
  commentLength = true;
  currentRate = 0;

  coupanObj = {
    code: "",
  };

  billingDetails = {
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    streetName: "",
    zip: "",
    country: "",
    city: "",
    phone: "",
  };

  orderObj = {
    user: "",
    firstName: "",
    lastName: "",
    orderNumber: "",
    accountOwner: this.adminId,
    product: "",
    unitPrice: "",
    accountNumber: "",
    productType: "",
    shippingAmount: "",
    delivery: "", // ye bhi ni aye ga
    invoiceStatus: "",
    stage: "",
    collar: "",
    collarContrast: "",
    cuffs: "",
    cuffsContrast: "",
    collarcuffstitching: "",
    placket: "",
    back: "",
    pocket: "",
    monogram: "",
    initial: "",
    style: "0",
    color: "",
    shirtFit: "",
    shirtLength: "",
    innerContrast: "",
    button: "",
    buttonThread: "0",
    comissionStatus: "",
    contrastFabric: "",
    placement: "",
    interlining: "",
    bottomStyle: "",
    totalPrice: 0,
    modifiedBy: null,
    createdBy: null,
    brand: "", // ye bhi ni aye ga
    measurement: null,
    price: 0,
    quantity: "",
    orderType: "",
    isfree: false,
    advancePayment: "0",
    fields: [],
    coupan: null,
    fromweb: true,
    billingaddress: "",
    billingdetail: "",
    paymentObj: {
      amount: 0,
      currency: "usd",
      source: "",
      description: "Thanks for Order.",
    },
  };

  review = {
    star: 0,
    comment: "",
    order: "",
  };

  constructor(
    private prodSrv: ProductsService,
    private ordSrv: OrderService,
    private toster: ToastrService,
    public datepipe: DatePipe,
    private userSrv: UserService,
    private countrySrv: CountryService,
    private router: Router,
    private appService: AppService,
    private config: NgbRatingConfig,
    private extraSrv: ExtraService,
    private stripeService: StripeService,
    private fb: FormBuilder
  ) {
    this.config.max = 5;
    this.config.readonly = false;
    // if (!this.stripeScriptTag.StripeInstance) {
    //   this.stripeScriptTag.setPublishableKey('');
    // }
    this.stripeTest = this.fb.group({
      name: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadStripe();
    this.loader = true;
    this.countrySrv.getAll().subscribe((resp: any) => {
      this.countries = resp.data;
      // this.billingDetails.country =
      //   resp.data.length > 0 ? resp.data[0].country.name : "0";
    });

    this.todayDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.localCartPreoducts();
    this.getAddressfromLocal();

    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user);
    this.billingDetails = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      address1: "",
      streetName: "",
      zip: "",
      country: "",
      city: "",
      phone: "",
    };
    if (this.user) {
      this.userSrv.getById(this.user._id).subscribe((resp: any) => {
        console.log(resp);
        this.billingDetails.address1 = resp.data.house.address;
        this.billingDetails.streetName = resp.data.house.street;
        this.billingDetails.phone = resp.data.phone;
        this.billingDetails.zip = resp.data.house.zip;
        this.billingDetails.country = resp.data.house.country;
        this.billingDetails.city = resp.data.house.city;
        console.log(this.billingDetails);
        this.ordSrv.userBillingDetails(this.user._id).subscribe((resp: any) => {
          console.log(resp);
          if (resp.data != null) {
            this.billingDetails = {
              firstName: resp.data.firstName
                ? resp.data.firstName
                : this.user.firstName,
              lastName: resp.data.lastName
                ? resp.data.lastName
                : this.user.lastName,
              email: resp.data.email ? resp.data.email : this.user.email,
              address1: resp.data.address1,
              streetName: resp.data.streetName,
              zip: resp.data.zip,
              country: resp.data.country,
              city: resp.data.city,
              phone: resp.data.phone,
            };
          }

        });
      });
    }
  }
  createToken(): void {
    const name = this.stripeTest.get("name").value;
    console.log(this.card.element);
    // this.stripeService
    //   .createToken(this.card.element, { name })
    //   .subscribe((result) => {
    //     if (result.token) {
    //       // Use the token
    //       console.log(result.token.id);
    //     } else if (result.error) {
    //       // Error creating the token
    //       console.log(result.error.message);
    //     }
    //   });
  }

  openModal() {
    this.router.navigate(['login'])
    // document.getElementById("openAuthModel").click();
  }
  logout() {
    localStorage.clear();
    location.href = "";
  }
  pay() {
    for (const key in this.billingDetails) {
      if (Object.prototype.hasOwnProperty.call(this.billingDetails, key)) {
        if (this.billingDetails[key] == "") {
          this.invalidFormatte = true;
          break;
        } else {
          this.invalidFormatte = false;
        }
      }
    }
    if (!this.invalidFormatte) {
      var user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        this.router.navigate(['login'])
        // document.getElementById("openAuthModel").click();
        this.toast("Login required", "error", 3000);
      } else {
        localStorage.setItem(
          "billingDetails",
          JSON.stringify(this.billingDetails)
        );

        this.orderObj.fields = [];
        var coup = JSON.parse(localStorage.getItem("coupan"));
        var billingDetails = JSON.parse(localStorage.getItem("billingDetails"));
        let fields = JSON.parse(localStorage.getItem("cart"));
        var measurement = JSON.parse(localStorage.getItem("productSizes"));
        var productInfo = JSON.parse(localStorage.getItem("productInfo"));
        for (let i = 0; i < fields.length; i++) {
          var meas: any;
          if (measurement) {
            var x = measurement.findIndex(
              (item) => item.productId == fields[i].id
            );
            meas = x != -1 ? measurement[x].measurement : null;
          }

          var extraInfo: any;
          if (productInfo) {
            var z = productInfo.findIndex(
              (item) => item.productId == fields[i].id
            );
            extraInfo = z != -1 ? productInfo[z] : null;
          }

          this.orderObj.fields.push({
            id: fields[i].id,
            info: extraInfo,
            qty: fields[i].qty,
            size: fields[i].size,
            measurement: meas,
          });
        }

        this.orderObj.user = user._id;
        this.orderObj.createdBy = user._id;
        this.orderObj.modifiedBy = user._id;
        this.orderObj.firstName = user.username;
        this.orderObj.coupan = coup != null ? coup._id : null;
        this.orderObj.billingaddress = billingDetails;
        this.orderObj.shippingAmount = this.shippingAmount;
        this.orderObj.paymentObj.amount = this.finalAmount;
        var name = billingDetails.firstName + " " + billingDetails.lastName;
        console.log(fields,this.orderObj);
        this.stripeService
          .createToken(this.card.element, { name })
          .subscribe((result) => {
            if (result.token) {
              // Use the token
              console.log(result.token.id);

              this.orderLoader = true;
              // You can access the token ID with `token.id`.
              // Get the token ID to your server-side code for use.
              this.orderObj.paymentObj.source = result.token.id;
              this.ordSrv.createOrder(this.orderObj).subscribe((resp: any) => {
                console.log(resp);
                if (resp.message == "success") {
                  this.toast("Order created successfully", "success", 3000);
                  localStorage.removeItem("productSizes");
                  localStorage.removeItem("billingDetails");
                  localStorage.removeItem("coupan");
                  localStorage.removeItem("cart");
                  localStorage.removeItem("productInfo");
                  this.abletoReview = true;

                  this.prodSrv.cartItems = 0;
                  this.review.order = resp.data._id;
                  this.router.navigate(["/success"]);
                } else if (resp.message == "quantity is larger then current") {
                  this.toast("Quantity is larger then current", "error", 3000);
                } else if (resp.message == "cardIssue") {
                  this.toast("Problem in Card", "error", 3000);
                } else {
                  console.log("something went wrong");
                }
                this.orderLoader = false;
              });
            } else if (result.error) {
              // Error creating the token
              console.log(result.error.message);
              this.toast(result.error.message, "error", 3000);
            }
          });

        // var handler = (<any>window).StripeCheckout.configure({
        //   key: "pk_live_eqgpLuCgwB1mn0qjduHrIA7V",
        //   locale: "auto",
        //   token: (resp: any) => {
        //     this.orderLoader = true;
        //     // You can access the token ID with `token.id`.
        //     // Get the token ID to your server-side code for use.
        //     this.orderObj.paymentObj.source = resp.id;
        //     this.ordSrv.createOrder(this.orderObj).subscribe((resp: any) => {
        //       if (resp.message == "success") {
        //         this.toast("Order created successfully", "success", 3000);
        //         localStorage.removeItem("productSizes");
        //         localStorage.removeItem("billingDetails");
        //         localStorage.removeItem("coupan");
        //         localStorage.removeItem("cart");
        //         localStorage.removeItem("productInfo");
        //         this.abletoReview = true;
        //         this.router.navigate(["/home"]);
        //         this.prodSrv.cartItems = 0;
        //         this.review.order = resp.data._id;
        //       } else if (resp.message == "Quantity is larger then current") {
        //         this.toast("Quantity is larger then current", "error", 3000);
        //       } else if (resp.message == "cardIssue") {
        //         this.toast("Problem in Card", "error", 3000);
        //       } else {
        //         console.log("something went wrong");
        //       }
        //       this.orderLoader = false;
        //     });
        //   },
        // });

        // handler.open({
        //   name: "Gravaldi",
        //   description: "Online payment processing for internet businesses",
        //   amount: 0,
        // });
      }
    }
  }

  updateRating() {
    if (!this.commentLength) {
      this.ordSrv.orderRating(this.review).subscribe((resp: any) => {
        if (resp.message == "success") {
          this.router.navigate(["/home"]);
          this.toast(
            "You give " + this.review.star + " Star of this Order",
            "success",
            3000
          );
        }
      });
    }
  }

  checkCommentdesc() {
    this.commentLength = this.review.comment.length >= 10 ? false : true;
  }

  loadStripe() {
    // if (!window.document.getElementById("stripe-script")) {
    //   var s = window.document.createElement("script");
    //   s.id = "stripe-script";
    //   s.type = "text/javascript";
    //   s.src = "https://checkout.stripe.com/checkout.js";
    //   s.onload = () => {
    //     this.handler = (<any>window).StripeCheckout.configure({
    //       key: "pk_live_eqgpLuCgwB1mn0qjduHrIA7V",
    //       locale: "auto",
    //       token: function (token: any) {
    //         // You can access the token ID with `token.id`.
    //         // Get the token ID to your server-side code for use.
    //         // alert('Payment Success!!');
    //       },
    //     });
    //   };
    //   window.document.body.appendChild(s);
    // }
  }

  localCartPreoducts() {
    var getCart = JSON.parse(localStorage.getItem("cart"));
    if (getCart) {
      this.prodSrv.getProductsByIds(getCart).subscribe((resp: any) => {
        this.cartProducts = resp.data;

        console.log(
          this.cartProducts,
          "cart products on checkout page==========="
        );
        this.summary(this.cartProducts);
        this.getCoupanfromLocal();
        this.loader = false;
      });
    }
  }

  summary(data) {
    let finalAmount: any = 0;
    let subtotal: any = 0;
    for (let index = 0; index < data.length; index++) {
      if (data[index].price != null) {
        finalAmount +=
          (data[index].price + (data[index].size.monogram == true ? 10 : 0)) *
          data[index].qty;
        subtotal +=
          (data[index].price + (data[index].size.monogram == true ? 10 : 0)) *
          data[index].qty;
      }
    }
    this.subtotal = subtotal.toFixed(2);
    let tempShip = 20;
    this.shippingAmount = subtotal < 200 ? tempShip.toFixed(2) : 0;
    // let tofixFinal =
    this.finalAmount = (
      parseInt(finalAmount.toFixed(2)) + parseInt(this.shippingAmount)
    ).toFixed(2);
  }

  getCoupanfromLocal() {
    var cp = JSON.parse(localStorage.getItem("coupan"));
    if (cp) {
      this.getCoupan = cp;
      this.coupanObj.code = cp.code;
      this.isCoupanExist = true;
      if (cp.discountIs == "Percentage") {
        const percentageOff = (
          price: number,
          percentageValue: number
        ): number => {
          return price * (1 - percentageValue / 100);
        };
        var final = percentageOff(this.finalAmount, cp.discount);
        this.finalAmount = final.toFixed(2);
      } else {
        let am: any = "";
        am = this.finalAmount - cp.discount;
        this.finalAmount = final.toFixed(2);
      }
    }
  }

  deleteCoupan() {
    localStorage.removeItem("coupan");
    this.coupanObj.code = "";
    this.isCoupanExist = false;
    this.summary(this.cartProducts);
  }

  getAddressfromLocal() {
    let x = JSON.parse(localStorage.getItem("billingDetails"));
    if (x) {
      this.billingDetails.firstName = x.firstName;
      this.billingDetails.lastName = x.lastName;
      this.billingDetails.city = x.city;
      this.billingDetails.country = x.country;
      this.billingDetails.zip = x.zip;
      this.billingDetails.address1 = x.address1;
      this.billingDetails.streetName = x.streetName;
      this.billingDetails.phone = x.phone;
    }
  }

  toast(message, status, time) {
    if (status == "success") {
      this.toster.success(message, "Message", {
        timeOut: time,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    } else if (status == "error") {
      this.toster.error(message, "Message", {
        timeOut: time,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    }
  }
}
