import { Component, OnInit, Pipe,OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { ProductsService } from "../../Services/products.service";
import { ExtraService } from "../../Services/extra.service";
import { AppService } from "../../app.service";
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../Services/order.service";
import { MeasurementService } from "../../Services/measurement.service";
import { take } from "rxjs/operators";


@Component({
  selector: "app-product-customize",
  templateUrl: "./product-customize.component.html",
  styleUrls: ["./product-customize.component.scss"],
})
export class ProductCustomizeComponent implements OnInit,OnDestroy {
  user = JSON.parse(localStorage.getItem("user"));

  // static super admin_iD
  superAdmin = "60c86200156c8d53bc93c604";
  colorDropdown = false;
  collarDropdown = false;
  cuffDropdown = false;
  pocketDropdown = false;
  buttonDropdown = false;
  placketDropdown = false;
  monogramDropdown = false;
  stageDropdown = false;
  backDropdown = false;
  bottomStyleDropdown = false;
  inner_contrastDropdown = false;
  interliningDropdown = false;
  currentTab = "Fabric";

  placeholderImage = "../../../assets/favicon_bigsize.png";
  liveBaseUrl = "https://api.gravaldicrm.com";
  baseUrl = environment.baseUrl;
  videoUrl: SafeResourceUrl;
  productId: any;
  specificproduct: any;
  measurement: any;
  ProductPatterns = [];
  ProductFabrics = [];
  ProductStyles = [];
  ProductColors = [];
  sizez = [];
  fabrics = [];
  placements = [];
  styles = [];
  style = false;
  color = false;
  pattern = false;
  fabric = false;
  sizeLoader = false;

  measurementObj = {};
  ext_ord: any;
  errorForSizefield = false;
  mySubscription: any;

  loadmore = false;
  left_side_loader = false;
  search_loader = false;
  loader = false;
  count = 0;
  prodObj = {
    id: "",
    limit: 20,
    skip: 0,
    searchText: "",
  };
  ext = {
    sizeData: [],
    fitData: [],
  };
  measurmentType = {
    key: "type",
    typ: "type",
    Obj: null,
    selected: false,
    value: "",
  };
  sizeObj = {
    fit: "",
    sizeType: "",
    monogram: false,
    measurementId: "",
    measurementName: "",
  };
  newMeaurementId = "";
  measurementNameError = false;
  productInfo = {
    fabric: "",
    fabric_summary: "",
    color: "",
    color_summary: "",
    collar: "",
    collar_summary: "",
    cuffs: "",
    cuffs_summary: "",
    placket: "",
    placket_summary: "",
    pocket: "",
    pocket_summary: "",
    buttons: "",
    buttons_summary: "",
    placement: "",
    placement_summary: "",
    stage: "",
    stage_summary: "",
    back: "",
    back_summary: "",
    bottomStyle: "",
    bottomStyle_summary: "",
    inner_contrast: "",
    inner_contrast_summary: "",
    interlining: "",
    interlining_summary: "",
    monogram: false,
    monogram_summary: false,
    productId: "",
    initials: "",
    style: "",
    style_summary: "",
  };
  favouriteProduct = {
    user: "",
    product: "",
    favourite: false,
  };

  infoData = {
    title: "",
    img: "",
    text: "",
  };

  customizeId = "626a6d78493dfeac6ff1bc8d";
  isCustome = false;
  mongramPrice = 0;
  custom_measurement: any = null;
  measurements: any[];

  isLoggedIn = false;
  moveToSize = false;
  
  constructor(
    private route: ActivatedRoute,
    private productservice: ProductsService,
    private extraSrv: ExtraService,
    private appService: AppService,
    protected _sanitizer: DomSanitizer,
    protected toastSrv: ToastrService,
    private ordSrv: OrderService,
    private router: Router,
    private measurementService: MeasurementService
  ) {
    if (localStorage.getItem("customize")) {
      this.isCustome = true;
      console.log(this.isCustome);
      this.currentTab = "Sizes";
      localStorage.removeItem("customize");
    }
    this.route.queryParamMap.subscribe((data: any) => {
      console.log(data.params);
      if (data.params.moveToSizes == "1") {
        this.moveToSize = true;
        this.currentTab = "Sizes";
      }
    });
   

    this.loadMeasurements();
  }

  ngOnInit() {
    this.loader = true;
    this.productId = this.route.snapshot.params["id"];
    this.productInfo.productId = this.productId;
    this.prodObj.id = this.productId;
    this.extraSrv.navBarPosition$.next("fixed");

    this.prodgetById();
    this.sizeExtras();
    this.stylefromLocal();

    if (this.user) {
      this.isLoggedIn = true;
      this.favouriteProduct.user = this.user._id;
      this.favouriteProduct.product = this.productId;
      this.productservice
        .getfavouriteProduct(this.favouriteProduct)
        .subscribe((resp: any) => {
          this.favouriteProduct.favourite =
            resp.data == null || !resp.data.favourite ? false : true;
        });
    }

    // sizes
    this.extraSrv.sizeType().subscribe((resp: any) => {
      this.ext.sizeData = resp.sizeData;
      this.ext.fitData = resp.fitData;
    });

    const customize = JSON.parse(localStorage.getItem("cart"));

    let found = false;
    // console.log({customize});
    if (customize) {
      var x = customize.findIndex((item) => item.id == this.productId);
      if (x != -1) {
        this.sizeObj.fit = customize[x].size.fit;
        this.sizeObj.sizeType = customize[x].size.sizeType;
        this.sizeObj.measurementId = customize[x].size.measurementId;
        this.sizeObj.measurementName = customize[x].size.measurementName;
        found = true;
      } else {
        found = false;
      }
    } else {
      found = false;
    }

    if (found) {
      setTimeout(() => {
        if (this.isCustome) {
          this.sizeObj.sizeType = "";
          this.sizeObj.fit = "";
          this.sizeObj.measurementId = "";
          this.sizeObj.measurementName = "";
        }
        this.defalt(this.sizeObj.sizeType);
      }, 1000);
    } else {
      this.extraSrv.sizeType().subscribe((resp: any) => {
        // default measurment sizes by sizeType
        if (resp.sizeData.length > 0) {
          this.sizeObj.sizeType = resp.sizeData[0]["_id"];
          this.sizeObj.fit = resp.fitData[0]["value"];
          setTimeout(() => {
            if (this.isCustome) {
              this.sizeObj.sizeType = "";
              this.sizeObj.fit = "";
              this.defalt(this.customizeId);
            } else {
              this.defalt(resp.sizeData[0]["_id"]);
            }
          }, 1000);
        }
      });
    }

    const types = {
      ProductFabrics: "Product Fabrics",
      ProductColors: "Product Colors",
    };

    this.extraSrv.gteall_extrasByName(types).subscribe((resp: any) => {
      this.ProductFabrics = resp.Prodfabrics;
      this.ProductColors = resp.Prodcolors;
    });

    this.ordSrv.extGetForweb().subscribe((resp: any) => {
      this.placements = resp["placement"];
      this.styles = resp["style"];
    });
  }

  async loadMeasurements() {
    const data: any = await this.measurementService
      .getallByUser(this.user._id)
      .pipe(take(1))
      .toPromise();

    this.measurements = data.data;
    if (this.sizeObj.measurementId != "") {
      for (const item of this.measurements) {
        if (item["_id"] == this.sizeObj.measurementId) {
          this.custom_measurement = item;
          this.defalt("custom");
        }
      }
    }
    // this.sizeObj.measurementName = "";
  }

  addMongogramPrice(price) {
    return parseInt(price) + (this.productInfo.monogram_summary ? 10 : 0);
  }

  infoDataChange(link, text, title) {
    console.log(link, text);
    this.infoData.title = title;
    this.infoData.img = this.baseUrl + "/" + link;
    this.infoData.text = text;
  }

  changeFabric(id) {
    this.left_side_loader = true;
    this.productId = id;
    this.productInfo.fabric = id;
    this.prodObj.id = this.productId;
    this.router.navigate(["/productcustomize/" + this.productId]);

    if (this.user) {
      this.favouriteProduct.user = this.user._id;
      this.favouriteProduct.product = this.productId;
      this.productservice
        .getfavouriteProduct(this.favouriteProduct)
        .subscribe((resp: any) => {
          this.favouriteProduct.favourite =
            resp.data == null || !resp.data.favourite ? false : true;
        });
    }
    var customize = JSON.parse(localStorage.getItem("cart"));
    var found = false;
    if (customize) {
      var x = customize.findIndex((item) => item.id == this.productId);
      if (x != -1) {
        this.sizeObj.fit = customize[x].size.fit;
        this.sizeObj.sizeType = customize[x].size.sizeType;
        found = true;
      } else {
        found = false;
      }
    } else {
      found = false;
    }

    if (found) {
      setTimeout(() => {
        this.defalt(this.sizeObj.sizeType);
      }, 1000);
    } else {
      this.extraSrv.sizeType().subscribe((resp: any) => {
        // default measurment sizes by sizeType
        if (resp.sizeData.length > 0) {
          this.sizeObj.sizeType = resp.sizeData[0]["_id"];
          this.sizeObj.fit = resp.fitData[0]["value"];
          setTimeout(() => {
            this.defalt(resp.sizeData[0]["_id"]);
          }, 1000);
        }
      });
    }

    this.productservice.productdetail(this.productId).subscribe((data: any) => {
      this.specificproduct = data.data;
      console.log(this.specificproduct);
      let info = JSON.parse(localStorage.getItem("productInfo"));
      if (info) {
        let x = info.findIndex((item) => item.productId == this.productId);
        if (x != -1) {
          let y = info[x];
          this.productInfo = y;
        }
      }
      this.extraSrv.getAll_sizeExtras().subscribe((item: any) => {
        this.sizez = [];
        for (let i = 0; i < item.data.length; i++) {
          this.sizez.push({
            key: this.makeKeyName(item.data[i].typ),
            typ: item.data[i].typ,
            Obj: item.data[i].video,
            selected: false,
            value: "",
          });
        }

        // this.sizez.push(this.measurmentType)
        let meas = JSON.parse(localStorage.getItem("productSizes"));
        if (meas != null) {
          let x = meas.findIndex((item) => item.productId == this.productId);
          if (x != -1) {
            let y = meas[x]["measurement"];
            for (const key in y) {
              if (Object.prototype.hasOwnProperty.call(y, key)) {
                for (let i = 0; i < this.sizez.length; i++) {
                  if (key == this.sizez[i].key) {
                    this.sizez[i].value = y[key];
                    break;
                  }
                }
              }
            }
          }
        }
      });
      this.left_side_loader = false;
    });

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  searchFabric() {
    this.search_loader = true;
    this.prodObj.skip = 0;
    this.productservice.getAll(this.prodObj).subscribe((resp: any) => {
      this.fabrics = [];

      this.fabrics.push(...resp.data);
      this.prodObj.skip++;
      this.search_loader = false;
    });
  }
  resetSizes() { }

  prodgetById() {
    this.productservice.productdetail(this.productId).subscribe((data: any) => {
      this.specificproduct = data.data;
      console.log(this.specificproduct);
      this.productservice.getAll(this.prodObj).subscribe((resp: any) => {
        this.count = resp.count;
        console.log(resp.data);
        this.fabrics = [];
        this.fabrics.push(this.specificproduct);
        this.fabrics.push(...resp.data);
        this.productInfo.fabric = this.productId;
        this.prodObj.skip++;

        this.ordSrv.extGetForweb().subscribe((resp: any) => {
          console.log(resp);
          this.ext_ord = resp;
          this.loader = false;
        });
      });
    });
  }

  open1(content, options = {}, data) {
    if (data) document.getElementById(data).click();
    setTimeout(() => {
      this.appService.openModal(content, options);
    }, 100);
  }

  sizeExtras() {
    this.extraSrv.getAll_sizeExtras().subscribe((item: any) => {
      this.sizez = [];
      for (let i = 0; i < item.data.length; i++) {
        this.sizez.push({
          key: this.makeKeyName(item.data[i].typ),
          typ: item.data[i].typ,
          Obj: item.data[i].video,
          selected: false,
          value: "",
        });
      }

      // this.sizez.push(this.measurmentType)
      let meas = JSON.parse(localStorage.getItem("productSizes"));
      if (meas != null) {
        let x = meas.findIndex((item) => item.productId == this.productId);
        if (x != -1) {
          let y = meas[x]["measurement"];
          for (const key in y) {
            if (Object.prototype.hasOwnProperty.call(y, key)) {
              for (let i = 0; i < this.sizez.length; i++) {
                if (key == this.sizez[i].key) {
                  this.sizez[i].value = y[key];
                  break;
                }
              }
            }
          }
        }
      }
    });
  }

  fabricScroll(e) {
    console.log("scrolled", e, this.prodObj.skip);
    if (e.target.scrollTop / e.target.scrollHeight) {
      if (this.loadmore == false && this.currentTab == "Fabric") {
        this.loadMore();
      }
    }
  }

  defalt(val) {
    this.sizeObj.measurementId = "";
    if (val == "") {
      this.isCustome = true;
      for (let o = 0; o < this.sizez.length; o++) {
        this.sizez[o].value = 0;
      }
      //
    } else if (val === "custom" && this.custom_measurement) {
      console.log(this.custom_measurement);
      this.sizeLoader = true;

      // this.sizeObj.sizeType = this.customizeId;
      // this.sizeObj.fit = this.custom_measurement.bodyType;
      this.sizeObj.measurementId = this.custom_measurement._id;
      console.log(this.sizeObj);
      for (const item of this.sizez) {
        const size = this.sizez.find((x) => x.key === item.key);
        size.value = this.custom_measurement[item.key];
      }
      this.sizeLoader = false;
      //
    } else {
      if (!this.moveToSize) {
        this.sizeLoader = true;
        this.extraSrv
          .Size_defaultValues(val === "custom" ? this.sizeObj.sizeType : val)
          .subscribe((resp: any) => {
            console.log(resp.data);
            for (let o = 0; o < this.sizez.length; o++) {
              for (let j = 0; j < resp.data.values.length; j++) {
                if (
                  this.sizez[o].typ == resp.data.values[j].extratype.typ &&
                  this.sizeObj.fit == resp.data.values[j].shirtFit
                ) {
                  this.sizez[o].value = resp.data.values[j].value;
                }
              }
            }
            this.sizeLoader = false;
          });
          this.moveToSize = false;
      }

    }

    console.log(this.sizez);

    this.measurement = this.sizez[0];
    if (this.measurement && this.measurement.Obj != null) {
      let url = "https://www.youtube.com/embed/" + this.measurement.Obj.videoId;
      this.videoUrl = this.transform(url);
    }
    // this.saveSize()
  }

  searchVideo(item) {
    this.measurement = item;
    if (this.measurement.Obj != undefined || this.measurement.Obj != null) {
      let url = "https://www.youtube.com/embed/" + this.measurement.Obj.videoId;
      this.videoUrl = this.transform(url);
    } else {
      this.videoUrl = "";
    }
  }

  stylefromLocal() {
    let info = JSON.parse(localStorage.getItem("productInfo"));
    if (info) {
      let x = info.findIndex((item) => item.productId == this.productId);
      if (x != -1) {
        let y = info[x];
        this.productInfo = y;
      }
    }
  }

  async saveSize(toast = true, redirectToLogin = false, saveToServer = false) {
    this.measurementNameError = false;
    if (this.isLoggedIn) {
      if (this.custom_measurement == null) {
        if (this.sizeObj.measurementName == "") {
          this.measurementNameError = true;
          this.toast("Must enter measurement name", "error", 2000);
          return;
        }
      }
    } else {
      redirectToLogin = true;
      saveToServer = false;
    }


    let obj = {};
    var valid = false;

    for (let i = 0; i < this.sizez.length; i++) {
      obj[this.sizez[i].key] = this.sizez[i].value;
      if (!this.sizez[i].value) {
        this.sizez[i].selected = true;
        valid = true;
      } else {
        this.sizez[i].selected = false;
      }
    }

    // if (!valid) {
    this.measurementObj = obj;
    this.measurementObj["createdBy"] = null;
    this.measurementObj["user"] = null;
    this.measurementObj["modifiedBy"] = null;
    this.measurementObj["owner"] = this.superAdmin;
    this.measurementObj["isCreatedByAdmin"] = false;
    let measObj = {
      productId: this.productId,
      measurement: this.measurementObj,
    };
    if (saveToServer) {
      var loggedInUser = this.user;
      this.measurementObj["name"] = this.sizeObj.measurementName;
      this.measurementObj["bodyType"] = this.sizeObj.fit;
      this.measurementObj["createdBy"] = loggedInUser._id;
      this.measurementObj["modifiedBy"] = loggedInUser._id;
      this.measurementObj["user"] = loggedInUser._id;
      this.measurementObj["firstName"] = loggedInUser.firstName;
      this.measurementObj["lastName"] = loggedInUser.lastName;
      this.measurementObj["accountNumber"] =
        loggedInUser.prefixAccountNumber + loggedInUser.postfixAccountNumber;
      this.measurementObj["stage"] = "0";
      this.measurementObj["comment"] = "";
      this.measurementObj["isCreatedByAdmin"] = false;
      console.log(this.measurementObj);
      var measur = await this.measurementService.create(this.measurementObj).pipe(take(1)).toPromise();
      this.sizeObj.measurementId = measur["user"]["_id"]
      this.sizeObj.measurementName = "";
      this.loadMeasurements();

      // this.defalt('custom')
      console.log(measur);
    }
    this.productservice.storeMeasurment(measObj, this.productId, toast);
    console.log(this.sizeObj);
    this.productservice.updateCart(
      this.sizeObj,
      this.productId,
      "go_customize_"
    );
    // } else {
    //   this.toast("Fill all required fields", "error", 2000);
    // }
    if (redirectToLogin) {
      localStorage.setItem('redirect', window.location.href);
      this.router.navigate(["login"]);
    }
  }

  // this funtion return measurement veriabales Name like(Measurement Collar = 'collarSize')
  makeKeyName(name) {
    var value = "";
    if (name == "Measurement Collar") {
      value = "collarSize";
      return value;
    } else if (name == "Measurement Chest") {
      value = "chest";
      return value;
    } else if (name == "Measurement Waist") {
      value = "waist";
      return value;
    } else if (name == "Measurement Sleeve") {
      value = "sleeveLength";
      return value;
    } else if (name == "Measurement Shirt Length") {
      value = "shirtLength";
      return value;
    } else if (name == "Measurement Shirt Size") {
      value = "shirtSize";
      return value;
    } else if (name == "Measurement Biceps") {
      value = "biceps";
      return value;
    } else if (name == "Measurement Hips") {
      value = "hips";
      return value;
    } else if (name == "Measurement Shoulders") {
      value = "Shoulders";
      return value;
    } else if (name == "Measurement CrossFront") {
      value = "CrossFront";
      return value;
    } else if (name == "Measurement SleeveCrownFront") {
      value = "SleeveCrownFront";
      return value;
    } else if (name == "Measurement CrossBack") {
      value = "CrossBack";
      return value;
    } else if (name == "Measurement ArmholeDepth") {
      value = "ArmholeDepth";
      return value;
    }
  }
  // transform Url fro video against extrasType (Measurment Type) from footer in right side
  transform(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  // change tab from footer in right side
  changeTab(value) {
    this.currentTab = value;
  }
  // previous Tab function check validity (for prevoius tab is available or not?) footer in right side
  prevTab() {
    if (this.currentTab == "Summary") {
      this.currentTab = "Sizes";
    } else if (this.currentTab == "Sizes") {
      this.currentTab = "Style";
    } else if (this.currentTab == "Style") {
      this.currentTab = "Fabric";
    }
  }
  // Next Tab function check validity (for next tab is available or not?) footer in right side
  nextTab() {
    if (this.currentTab == "Fabric") {
      this.currentTab = "Style";
    } else if (this.currentTab == "Style") {
      this.currentTab = "Sizes";
    } else if (this.currentTab == "Sizes") {
      this.currentTab = "Summary";
    }
  }

  addToCart() {
    this.saveSize(false);
    console.log(this.sizeObj);
    console.log(this.productId);
    console.log(this.productInfo);
    this.sizeObj.monogram = this.productInfo.monogram_summary;

    console.log(this.sizeObj, this.productId, "addCart");
    console.log(this.sizeObj);
    this.productservice.updateCart(this.sizeObj, this.productId, "addCart");
  }

  loadMore() {
    this.loadmore = true;
    this.productservice.getAll(this.prodObj).subscribe((resp: any) => {
      this.count = resp.count;
      this.fabrics.push(...resp.data);
      this.prodObj.skip++;
      this.loadmore = false;
    });
  }
  // // Store values of extras [-------Start-------]

  // productfabric(id, val) {
  //   this.productInfo.fabric = id;
  //   this.productInfo.fabric_summary = val;
  //   this.saveStyle();
  // }

  productColor() {
    for (const item of this.ProductColors) {
      if (item["_id"] == this.productInfo.color) {
        this.productInfo.color_summary = item["title"];
        break;
      }
    }
    this.saveStyle();
  }
  productPlacement() {
    for (const item of this.placements) {
      if (item["_id"] == this.productInfo.placement) {
        this.productInfo.placement_summary = item["title"];
        break;
      }
    }
    this.saveStyle();
  }
  productStyle() {
    for (const item of this.styles) {
      if (item["_id"] == this.productInfo.style) {
        this.productInfo.style_summary = item["title"];
        break;
      }
    }
    this.saveStyle();
  }

  collapseAllDropDown(options: { skip: string }) {
    console.log(options, "options =======================");
    let accordionItemIds = [
      "collar_dropdown",
      "cuff_dropdown",
      "placket_dropdown",
      "pocket_dropdown",
      "button_dropdown",
      "back_dropdown",
      "bottomStyle_dropdown",
      "innerContrast_dropdown",
      "interLining_dropdown",
      "monogram_dropdown",
    ];

    accordionItemIds = accordionItemIds.filter((x) => x !== options.skip);



    for (const id of accordionItemIds) {
      if (document.getElementById(id).getAttribute("aria-expanded") == "true") {
        document.getElementById(id).click();
      }
    }
  }

  collapseAll(key) {
    console.log(key, "key ===============");
    this.collapseAllDropDown({ skip: key });
  }

  collarValue(id, val) {
    this.productInfo.collar = id;
    this.productInfo.collar_summary = val;

    this.collapseAllDropDown({ skip: "collar_dropdown" });
    // if (
    //   document
    //     .getElementById("collar_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("collar_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("cuff_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("cuff_dropdown").click();
    // }

    this.saveStyle();
  }
  closecollarValue() {
    // if (
    //   document
    //     .getElementById("collar_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("collar_dropdown").click();
    // } else {
    //   document.getElementById("cuff_dropdown").click();
    // }
    // if (
    //   (
    //     document
    //       .getElementById("cuff_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("cuff_dropdown").click();
    // }
  }

  cuffValue(id, val) {
    this.productInfo.cuffs = id;
    this.productInfo.cuffs_summary = val;

    this.collapseAllDropDown({ skip: "cuff_dropdown" });
    // if (
    //   document.getElementById("cuff_dropdown").getAttribute("aria-expanded") ==
    //   "true"
    // ) {
    //   document.getElementById("cuff_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("placket_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("placket_dropdown").click();
    // }
    this.saveStyle();
  }

  placketValue(id, val) {
    this.productInfo.placket = id;
    this.productInfo.placket_summary = val;

    this.collapseAllDropDown({ skip: "placket_dropdown" });
    // if (
    //   document
    //     .getElementById("placket_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("placket_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("pocket_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("pocket_dropdown").click();
    // }
    this.saveStyle();
  }

  pocketValue(id, val) {
    this.productInfo.pocket = id;
    this.productInfo.pocket_summary = val;

    this.collapseAllDropDown({ skip: "pocket_dropdown" });

    // if (
    //   document
    //     .getElementById("pocket_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("pocket_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("button_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("button_dropdown").click();
    // }
    this.saveStyle();
  }

  buttonsValue(id, val) {
    this.productInfo.buttons = id;
    this.productInfo.buttons_summary = val;

    this.collapseAllDropDown({ skip: "button_dropdown" });
    // if (
    //   document
    //     .getElementById("button_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("button_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("back_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("back_dropdown").click();
    // }
    this.saveStyle();
  }

  stagesValue(id, val) {
    this.productInfo.stage = id;
    this.productInfo.stage_summary = val;
    this.saveStyle();
  }

  backValue(id, val) {
    this.productInfo.back = id;
    this.productInfo.back_summary = val;

    this.collapseAllDropDown({ skip: "back_dropdown" });

    // if (
    //   document.getElementById("back_dropdown").getAttribute("aria-expanded") ==
    //   "true"
    // ) {
    //   document.getElementById("back_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("bottomStyle_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("bottomStyle_dropdown").click();
    // }
    this.saveStyle();
  }

  bottomStyleValue(id, val) {
    this.productInfo.bottomStyle = id;
    this.productInfo.bottomStyle_summary = val;

    this.collapseAllDropDown({ skip: "bottomStyle_dropdown" });

    // if (
    //   document
    //     .getElementById("bottomStyle_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("bottomStyle_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("innerContrast_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("innerContrast_dropdown").click();
    // }
    this.saveStyle();
  }

  inner_contrastValue(id, val) {
    this.productInfo.inner_contrast = id;
    this.productInfo.inner_contrast_summary = val;

    this.collapseAllDropDown({ skip: "innerContrast_dropdown" });

    // if (
    //   document
    //     .getElementById("innerContrast_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("innerContrast_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("interLining_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("interLining_dropdown").click();
    // }
    this.saveStyle();
  }

  interliningValue(id, val) {
    this.productInfo.interlining = id;
    this.productInfo.interlining_summary = val;

    this.collapseAllDropDown({ skip: "interLining_dropdown" });

    // if (
    //   document
    //     .getElementById("interLining_dropdown")
    //     .getAttribute("aria-expanded") == "true"
    // ) {
    //   document.getElementById("interLining_dropdown").click();
    // }
    // if (
    //   !(
    //     document
    //       .getElementById("monogram_dropdown")
    //       .getAttribute("aria-expanded") == "true"
    //   )
    // ) {
    //   document.getElementById("monogram_dropdown").click();
    // }
    this.saveStyle();
  }

  monogramCheck() {
    this.productInfo.monogram = !this.productInfo.monogram;
    this.productInfo.monogram_summary = this.productInfo.monogram;

    this.collapseAllDropDown({ skip: "monogram_dropdown" });

    if (this.productInfo.monogram) {
      this.mongramPrice = 10;
    } else {
      this.mongramPrice = 0;
    }
    this.saveStyle();
  }

  // function for use store value in localstorage
  saveStyle() {
    let info = JSON.parse(localStorage.getItem("productInfo"));
    if (!info) {
      let arr = [];
      arr.push(this.productInfo);
      localStorage.setItem("productInfo", JSON.stringify(arr));
    } else {
      let x = info.findIndex((item) => item.productId == this.productId);
      if (x == -1) {
        info.push(this.productInfo);
      } else {
        info.splice(x, 1);
        info.push(this.productInfo);
      }
      localStorage.setItem("productInfo", JSON.stringify(info));
    }
  }
  // Store values of extras [-------END-------]

  // change Size of measurment like 0.5 (minus)
  minusValue(index) {
    let i = 0.5;
    this.sizez[index].value =
      this.sizez[index].value != "" && this.sizez[index].value != 0
        ? this.sizez[index].value - i
        : this.sizez[index].value;
  }
  // change Size of measurment like 0.5 (PLus)
  plusValue(index) {
    let i = 0.5;
    this.sizez[index].value = this.sizez[index].value + i;
  }
  // Toast message for Alert.
  toast(message, status, time) {
    if (status == "success") {
      this.toastSrv.success(message, "", {
        timeOut: time,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    } else if (status == "error") {
      this.toastSrv.error(message, "", {
        timeOut: time,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    }
  }

  // Open Modal
  open(content, options = {}, data) {
    if (data) document.getElementById(data).click();
    setTimeout(() => {
      this.appService.openModal(content, options);
    }, 100);
  }

  goBack() {
    this.router.navigate(["/"]);

  }
  checkOut() {
    this.addToCart();
    this.router.navigate(["/checkout"]);
  }

  favouriteUpd() {
    if (this.user) {
      this.favouriteProduct.user = this.user._id;
      this.favouriteProduct.product = this.productId;
      this.productservice
        .addFavourite(this.favouriteProduct)
        .subscribe((resp: any) => {
          this.productservice
            .getfavouriteProduct(this.favouriteProduct)
            .subscribe((resp: any) => {
              this.favouriteProduct.favourite =
                resp.data == null || !resp.data.favourite ? false : true;
            });
        });
    }
  }

  ngOnDestroy(){
    this.extraSrv.navBarPosition$.next("unset");
  }
}