import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { ProductsService } from "../../Services/products.service";
import { OrderService } from "../../Services/order.service";
import { DatePipe } from "@angular/common";
import { UserService } from "../../Services/user.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  selectedMenu = "ACCOUNT DETAILS";
  orderType = "All Orders";
  cartProducts: any;
  baseUrl = environment.baseUrl;
  finalAmount: any = 0;
  subtotal = 0;
  shippingAmount = 0;
  todayDate: any;
  isCoupanExist = false;
  loader = false;
  coupanObj = {
    code: "",
  };
  getCoupan: any;

  constructor(
    private prodSrv: ProductsService,
    private ordSrv: OrderService,
    private toster: ToastrService,
    public datepipe: DatePipe,
    private userSrv: UserService
  ) {}

  ngOnInit() {
    this.loader = true;
    this.localCartPreoducts();
    this.todayDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  }
  addMonogramPrice(price, qty) {}
  localCartPreoducts() {
    var getCart = JSON.parse(localStorage.getItem("cart"));

    if (getCart) {
      console.log(getCart);
      this.prodSrv.getProductsByIds(getCart).subscribe((resp: any) => {
        console.log(resp);
        this.cartProducts = resp.data;
        this.summary(this.cartProducts);
        this.getCoupanfromLocal();
        this.loader = false;
      });
    } else {
      this.loader = false;
    }
  }

  addMongogramPrice(item) {
    return (item.price + (item.size.monogram == true ? 10 : 0)) * item.qty;
  }

  minusQty(i) {
    const myCart = JSON.parse(localStorage.getItem("cart"));
    // if (myCart[i].qty > 1) {
    myCart[i].qty--;
    localStorage.setItem("cart", JSON.stringify(myCart));
    this.cartProducts[i].qty--;
    this.summary(this.cartProducts);
    this.getCoupanfromLocal();
    // }
  }

  addQty(i) {
    // if (this.cartProducts[i].qty < this.cartProducts[i].totalquantity) {
    const myCart = JSON.parse(localStorage.getItem("cart"));
    myCart[i].qty++;
    localStorage.setItem("cart", JSON.stringify(myCart));

    this.cartProducts[i].qty++;
    this.summary(this.cartProducts);
    this.getCoupanfromLocal();
    // }
  }

  remove(i) {
    var getCart = JSON.parse(localStorage.getItem("cart"));
    if (getCart.length == 1) {
      localStorage.removeItem("coupan");
      localStorage.removeItem("cart");
      localStorage.removeItem("productInfo");
      this.coupanObj.code = "";
      this.isCoupanExist = false;
    }

    this.cartProducts.splice(i, 1);
    // localStorage
    var myCart = JSON.parse(localStorage.getItem("cart"));
    var info = JSON.parse(localStorage.getItem("productInfo"));

    if (myCart) {
      myCart.splice(i, 1);
      info.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(myCart));
      localStorage.setItem("productInfo", JSON.stringify(info));
    }
    this.prodSrv.cartItems = myCart != null ? myCart.length : 0;
    this.summary(this.cartProducts);
  }

  summary(data) {
    var productInfo = JSON.parse(localStorage.getItem("productInfo"));
    let am: any = 0;
    this.subtotal = 0;
    for (let index = 0; index < data.length; index++) {
      if (data[index].price != null) {
        // console.log(data[index]);
        var extraInfo;
        if (productInfo) {
          var z = productInfo.findIndex(
            (item) => item.productId == data[index]["_id"]
          );
          extraInfo = z != -1 ? productInfo[z] : null;
        }
        am +=
          (data[index].price + (data[index].size.monogram == true ? 10 : 0)) *
          data[index].qty;
        this.subtotal +=
          (data[index].price + (data[index].size.monogram == true ? 10 : 0)) *
          data[index].qty;
        data[index].productInfo = extraInfo;
      }
    }
    this.finalAmount = parseFloat(am).toFixed(2);
    this.cartProducts = data;
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

  applyCoupan() {
    this.ordSrv.checkCoupanBycode(this.coupanObj).subscribe((resp: any) => {
      if (resp.message == "no exist") {
        this.toast("Invalid Code", "error", 2000);
      } else if (resp.message == "success") {
        let startDate = this.datepipe.transform(
          resp.data.startDate,
          "yyyy-MM-dd"
        );
        let endDate = this.datepipe.transform(resp.data.endDate, "yyyy-MM-dd");
        if (resp.data.minimumAmount > this.finalAmount) {
          this.toast("Total Amount is less than required", "error", 4000);
        } else if (
          !(startDate <= this.todayDate && this.todayDate <= endDate)
        ) {
          this.toast("Date Expired", "error", 4000);
        } else {
          if (resp.data.discountIs == "Percentage") {
            const percentageOff = (
              price: number,
              percentageValue: number
            ): number => {
              return price * (1 - percentageValue / 100);
            };
            var final = percentageOff(this.finalAmount, resp.data.discount);
            this.finalAmount = final.toFixed(2);
            localStorage.setItem("coupan", JSON.stringify(resp.data));
            this.isCoupanExist = true;
            this.toast("Coupan Applied", "success", 3000);
          } else {
            let am = this.finalAmount - resp.data.discount;
            this.finalAmount = am.toFixed(2);
            localStorage.setItem("coupan", JSON.stringify(resp.data));
            this.isCoupanExist = true;
            this.toast("Coupan Applied", "success", 3000);
          }
          this.getCoupan = resp.data;
        }
      }
    });
  }

  deleteCoupan() {
    localStorage.removeItem("coupan");
    this.coupanObj.code = "";
    this.isCoupanExist = false;
    this.summary(this.cartProducts);
  }

  toast(message, status, time) {
    if (status == "success") {
      this.toster.success(message, "", {
        timeOut: time,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    } else if (status == "error") {
      this.toster.error(message, "", {
        timeOut: time,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    }
  }
}
