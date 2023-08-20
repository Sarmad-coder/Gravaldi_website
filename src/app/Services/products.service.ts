import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  cartItems = 0;
  public url = environment.baseUrl;
  constructor(private http: HttpClient, private toster: ToastrService) {
    if (JSON.parse(localStorage.getItem("cart"))) {
      this.cartItems = JSON.parse(localStorage.getItem("cart")).length;
    }
  }

  suggestedProducts(categoryName, id): Observable<any> {
    return this.http.get(
      this.url + "/product/suggestedProducts/" + categoryName + "/" + id
    );
  }
  addFavourite(data): Observable<any> {
    return this.http.post(this.url + "/product/addFavourite", data);
  }
  getfavouriteProduct(data): Observable<any> {
    return this.http.post(this.url + "/product/getfavouriteProduct", data);
  }
  getProductshome(data): Observable<any> {
    return this.http.post(this.url + "/product/shop/products", data);
  }
  getallProductslist(data): Observable<any> {
    return this.http.post(this.url + "/product/shop/all/products", data);
  }
  productdetail(id): Observable<any> {
    return this.http.get(this.url + "/product/" + id);
  }
  updateCart(sizeObj, productid, keyword) {
    var getCart = JSON.parse(localStorage.getItem("cart"));

    console.log(keyword, "keyword=========================");
    console.log(getCart, "getCart=========================");

    if (keyword == "addCart") {
      if (sizeObj.fit == "" || sizeObj.sizeType == "") {
        console.log("yahin say wapis karwa raha hun mein");
        this.toast("Please select Size", "error", 3000);
        return;
      }
    }
    /*check Above condition if size object if invalid*/

    if (keyword == "go_customize_") {
      var y: any;
      if (getCart) {
        y = getCart.findIndex((item) => item.id == productid);
        if (y != -1) {
          getCart[y].size.fit =
            sizeObj.fit != "" ? sizeObj.fit : getCart[y].fit;
          getCart[y].size.sizeType =
            sizeObj.sizeType != "" ? sizeObj.sizeType : getCart[y].sizeType;
            getCart[y].size.measurementId = sizeObj.measurementId;
            getCart[y].size.measurementName = sizeObj.measurementName;
          localStorage.setItem("cart", JSON.stringify(getCart));
        }
      } else {
        if (sizeObj.sizeType != "") {
          let customize = [
            {
              id: productid,
              size: sizeObj,
              qty: 1,
            },
          ];
          localStorage.setItem("cart", JSON.stringify(customize));

          var __getCart = JSON.parse(localStorage.getItem("cart"));
          this.cartItems = __getCart.length;
        }
      }
    } else if (keyword == "addCart") {
      console.log("iam in");
      if (getCart) {
        console.log(getCart, "getCart========================");
        let y = getCart.findIndex((x) => x.id === productid);
        if (y != -1) {
          // this.toast("Product Already Exist", "error", 2000);
          var x = {
            id: productid,
            qty: 1,
            size: sizeObj,
          };
          console.log(x, "x========================");
          getCart[y] = x;
          this.toast("Product Updated In Cart", "success", 2000);
        } else {
          var x = {
            id: productid,
            qty: 1,
            size: sizeObj,
          };
          console.log(x, "x========================");
          getCart.push(x);
          this.toast("Product Added In Cart", "success", 2000);
        }
        localStorage.setItem("cart", JSON.stringify(getCart));
          this.cartItems = getCart.length;
      } else {
        let cartArray = [
          {
            id: productid,
            qty: 1,
            size: sizeObj,
          },
        ];
        console.log(cartArray);
        localStorage.setItem("cart", JSON.stringify(cartArray));
        this.cartItems = cartArray.length;
        this.toast("Product Added In Cart", "success", 2000);
      }
    }
  }
  storeMeasurment(sizeObj, productId, toast = true) {
    let getMeasurement = JSON.parse(localStorage.getItem("productSizes"));
    if (!getMeasurement) {
      let arr = [];
      arr.push(sizeObj);
      localStorage.setItem("productSizes", JSON.stringify(arr));
      // this.toast("Measurment Saved", "success", 2000);
    } else {
      let x = getMeasurement.findIndex((item) => item.productId == productId);
      if (x == -1) {
        getMeasurement.push(sizeObj);
      } else {
        getMeasurement.splice(x, 1);
        getMeasurement.push(sizeObj);
      }
      localStorage.setItem("productSizes", JSON.stringify(getMeasurement));
      if (toast) {
      this.toast("Measurment Saved", "success", 2000);

      }
    }
  }
  getProductsByIds(data) {
    return this.http.post(this.url + "/product/getProductsByIds", data);
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
  reviewOfProduct(productId) {
    return this.http.get(this.url + "/product/reviewOfProduct/" + productId);
  }
  // getAll Products but not Equal current ProductId
  getAll(data) {
    return this.http.post(this.url + "/product/web/getall", data);
  }
}
