import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../Services/user.service";
import { CountryService } from "../../Services/country.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { OrderService } from "../../Services/order.service";
import { environment } from "../../../environments/environment.prod";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { AppService } from "../../app.service";
import { MeasurementService } from "../../Services/measurement.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  user = JSON.parse(localStorage.getItem("user"));
  selectedMenu = "ACCOUNT DETAILS";
  orderType = "All Orders";
  list3 = [];
  list1 = [];
  list2 = [];
  myOrders = [];
  sizez = [];
  countries: any;
  provinces: any;
  cities: any;
  baseUrl = environment.baseUrl;
  loggedInUser: any;
  allOrders: any;
  loader = false;
  refund = {
    user: "",
    order: "",
    reason: "",
    descripton: "",
  };
  formObj = {
    username: "",
    email: "",
    phone: "",
    password: "",
    house: {
      address: "",
      street: "",
      city: "",
      country: "",
      zip: "",
    },
    id: this.user._id,
  };
  imageSrc: any;
  measurements: any[] = [];
  populateMeasurement: any;
  showMeasurementDialog = false;

  constructor(
    private router: Router,
    private userSrv: UserService,
    private countrySrv: CountryService,
    private toster: ToastrService,
    private orderSrv: OrderService,
    private config: NgbRatingConfig,
    private appService: AppService,
    private measurementService: MeasurementService
  ) {
    this.config.max = 5;
    this.config.readonly = true;
  }

  ngOnInit() {
    if (this.user != null) {
      this.loader = true;
      this.userSrv.getById(this.user._id).subscribe((resp: any) => {
        this.loader = false;
        this.formObj.phone = resp.data.phone;
        this.formObj.house.city = resp.data.house.city;
        this.formObj.house.country = resp.data.house.country;
        this.formObj.house.zip = resp.data.house.zip;
        this.formObj.house.street = resp.data.house.street;
        this.formObj.house.address = resp.data.house.address;
        this.formObj.username = resp.data.username;
        this.formObj.email = resp.data.email;
        this.formObj.id = resp.data._id;
        this.orders("All Orders");

        this.orderSrv.allOrders(this.user._id).subscribe((resp: any) => {
          this.allOrders = resp.data;
          console.log(this.allOrders);

        });

        this.countrySrv.getAll().subscribe((resp: any) => {
          this.countries = resp.data;
          this.countrySrv
            .getallByCountryName(this.formObj.house.country)
            .subscribe((item: any) => {
              this.provinces = item.data;
              // if (this.formObj.house.province) {
              //   this.countrySrv.getallByProvinceName(this.formObj.house.province).subscribe((item: any) => {
              //     this.cities = item.data;
              //   })
              // }
            });
        });
      });
    }

    this.loadMeasurements();
  }

  async loadMeasurements() {
    const data: any = await this.measurementService
    .getallByUser(this.user._id)
    .pipe(take(1))
    .toPromise();

    this.measurements = data.data;
    console.log("callws 2");
  }


  async deleteMeasurement(item) {
    await this.measurementService.delete(item._id).pipe(take(1)).toPromise();
    this.loadMeasurements();
  }

  openModal(content, options = {}, imageSrc: string) {
    this.imageSrc = imageSrc;

    setTimeout(() => {
      this.appService.openModal(content, options);
    }, 100);
  }

  onChng(v) {
    if (this.list3.indexOf(v) == -1) this.list3.push(v);
  }

  onCountryChange() {
    this.countrySrv
      .getallByCountryName(this.formObj.house.country)
      .subscribe((item: any) => {
        this.provinces = item.data;
      });
  }

  onProvinceChange() {
    // this.countrySrv.getallByProvinceName(this.formObj.house.province).subscribe((item: any) => {
    //   this.cities = item.data;
    // })
  }

  update() {
    this.userSrv.updateAccount(this.formObj).subscribe((item: any) => {
      if (item.message == "success") {
        this.toster.success("Successfully Updated", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
      }
    });
  }

  deleteAccount() {
    this.userSrv.deleteAccount(this.formObj.id).subscribe((item: any) => {
      if (item.message == "success") {
        localStorage.clear();
        this.toster.success("Successfully delete", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
        this.router.navigate(["/home"]);
      }
    });
  }

  logout() {
    localStorage.clear();
    location.reload();
  }

  finalPrice(price) {
    let pr = parseFloat(price).toFixed(2);
    return pr;
  }

  // Orders
  orders(value) {
    this.orderType = value;
    if (value == "All Orders") {
      this.orderSrv.allOrders(this.user._id).subscribe((resp: any) => {
        this.myOrders = resp.data;
      });
    } else if (value == "Pending") {
      this.orderSrv.pendingOrders(this.user._id).subscribe((resp: any) => {
        this.myOrders = resp.data;
      });
    } else if (value == "Completed") {
      this.orderSrv.paidOrders(this.user._id).subscribe((resp: any) => {
        this.myOrders = resp.data;
      });
    } else if (value == "Deleted") {
      this.orderSrv.deletedOrders(this.user._id).subscribe((resp: any) => {
        this.myOrders = resp.data;
      });
    }
  }

  return(item) {
    this.refund.order = item._id;
    this.refund.user = this.user._id;

    this.orderSrv.refundOrder(this.refund).subscribe((resp: any) => {
      if (resp.message == "success") {
        this.toster.success("Your refund request has been submited", "", {
          timeOut: 5000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
        this.orderSrv.allOrders(this.user._id).subscribe((resp: any) => {
          this.allOrders = resp.data;
        });
      }
    });
  }
}
