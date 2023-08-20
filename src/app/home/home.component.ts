import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { AppService } from "../app.service";
import { ProductsService } from "../Services/products.service";
import { UserService } from '../Services/user.service';
import { ExtraService } from '../Services/extra.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  tabName = "all";

  loading: Boolean = false;
  loadingbtn: Boolean = false;
  skipObj = {
    skip: 0
  };
  baseUrl = environment.baseUrl;;
  productList: any = [];
  masterList: any = [];
  shopByweb: any;
  loadmore = true;
  constructor(
    private appService: AppService,
    private productservice: ProductsService,
    private _router: Router,
    private userSrv: UserService,
    private extraSrv: ExtraService
  ) {
    this.appService.pageTitle = "Home";
  }
  ngOnInit() {
    this.getallproducts();
    this.userSrv.byshop().subscribe((resp: any) => {
      this.shopByweb = resp.data[0];
    })
  }

  selectFilter(name) {
    this.productList = [];

    this.tabName = name;
    if (this.tabName == 'All') {
      this.productList = this.masterList;
    } else {
      let x = this.masterList.filter(item => item.style === this.tabName)
      this.productList = x;
    }
  }

  selectedProduct(id) {
    this._router.navigate(['/productdetail/' + id]);
  }

  getallproducts() {
    this.loading = true;
    this.productservice.getProductshome(this.skipObj).subscribe(
      (data: any) => {
        if (data.message == 'success') {
          this.productList = data.data;
          this.masterList = data.data;
          this.skipObj.skip = this.productList.length;
          this.loading = false;
        }
      }
    );
  }

  loadmoreproducts() {
    this.loadingbtn = true;
    this.productservice.getProductshome(this.skipObj).subscribe(
      (data: any) => {
        if (data.message == 'success') {
          //yahan pr hm apny skip k object m 8 plus kr k save krwa lain gy taak next time hm array m is m 8 plus kr k items mngwa skain
          this.skipObj.skip = this.productList.length + 8;
          //yahan pr hm data ko apni main array yaani product list m push krwa lain gy
          this.productList.push(...data.data);
          if (this.productList.length < 8) {
            this.loadmore = false;
          }
          else {
            this.loadmore = true;
          }
          this.loadingbtn = false;
        }
      });
  }
}
