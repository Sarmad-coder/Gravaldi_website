import { ExtraService } from "./../../Services/extra.service";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";
import { ProductsService } from "../../Services/products.service";
import { Meta } from "@angular/platform-browser";
import { MeasurementService } from "../../Services/measurement.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  user = JSON.parse(localStorage.getItem("user"));
  showImages = false;
  baseUrl = environment.baseUrl;
  desc: Boolean = false;
  detail: Boolean = false;
  review: Boolean = false;
  loading: Boolean = false;
  dropdown1 = false;
  dropdown2 = false;

  productId = "";
  specificproduct: any;
  suggestedProducts: any;
  ratngPercentage = 0;
  mySubscription: any;
  productImages: any = [];
  errorForSizefield = false;
  sizeApply = false;
  reviews: any = []; // array

  ext = {
    sizeData: [],
    fitData: [],
  };
  sizeObj = {
    fit: "",
    sizeType: "",
    monogram: false,
    measurementId: "",
    measurementName: "",
  };
  favouriteProduct = {
    user: "",
    product: "",
    favourite: false,
  };
  measurementObj = {};
  sizez = [];
  superAdmin = "60c86200156c8d53bc93c604";
  isLoggedIn = false;
  measurements: any[];
  selectedImage = "";
  disable: boolean = false;
  indux: number;
  constructor(
    private active_route: ActivatedRoute,
    private router: Router,
    private productservice: ProductsService,
    private toast: ToastrService,
    private extSrv: ExtraService,
    private metaService: Meta,
    private measurementService: MeasurementService
  ) {
    this.productId = this.active_route.snapshot.params.id;
  }
  addTag() {
    // this.metaService.addTag({ name: 'description', content: "" });
    // this.metaService.addTag({ name: 'robots', content: 'index,follow' });
    // this.metaService.addTag({ property: 'og:title', content: 'Content Title for social media' });
  }

  ngOnInit() {
    this.productdetail();
    this.getFavourite();
    this.reviewOfProduct();
    this.getExtra_Sizes();
    this.extSrv.getAll_sizeExtras().subscribe((item: any) => {
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


    });
    if (this.user) {
      this.loadMeasurements();
    }

  }
  changeSelectedImage(image) {
    this.showImages = true;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    this.selectedImage = image;
  }
  async loadMeasurements() {
    const data: any = await this.measurementService
      .getallByUser(this.user._id)
      .pipe(take(1))
      .toPromise();

    this.measurements = data.data;
    console.log(this.measurements)
    // if (this.newMeaurementId != "") {
    //   for (const item of this.measurements) {
    //     if (item["_id"] == this.newMeaurementId) {
    //       this.custom_measurement = item;
    //       this.defalt("custom");
    //       this.newMeaurementId = "";
    //     }
    //   }
    // }
    // this.sizeObj.measurementName = "";
  }
  changeMeansure(name, type, id, index) {
    if (this.disable) {
      this.disable = false;
      this.indux = null
      this.sizeObj.measurementName = "";
      this.sizeObj.fit = ""
      this.sizeObj.sizeType = "";
      this.sizeObj.measurementId = "";
      
    } else {
      this.disable = true;
      this.indux = index
      this.sizeObj.measurementName = name;
      this.sizeObj.fit = type
      this.sizeObj.sizeType = "custom";
      this.sizeObj.measurementId = id
    }
    console.log(name);



    console.log(this.sizeObj);
    // this.saveSize(false);
  }
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

  getExtra_Sizes() {
    this.extSrv.sizeType().subscribe((resp: any) => {
      this.ext.sizeData = resp.sizeData;
      this.ext.fitData = resp.fitData;
    });
  }

  reviewOfProduct() {
    this.productservice
      .reviewOfProduct(this.productId)
      .subscribe((resp: any) => {
        this.reviews = resp.data;
        this.ratngPercentage = resp.rating;
      });
  }

  getFavourite() {
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
  }

  favouriteUpd() {
    if (this.user) {
      console.log("user");
      this.favouriteProduct.user = this.user._id;
      this.favouriteProduct.product = this.productId;
      console.log(this.favouriteProduct, "this.favouriteProduct");
      this.productservice
        .addFavourite(this.favouriteProduct)
        .subscribe((resp: any) => {
          this.getFavourite();
        });
    } else {
      console.log("user else");
    }
  }
  saveSize(toast = true) {
    console.log(this.sizeObj)
    this.extSrv.Size_defaultValues(this.sizeObj.sizeType).subscribe((resp: any) => {
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
      console.log(this.sizez)
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
      console.log(measObj);
      const resp1 = this.productservice.storeMeasurment(measObj, this.productId, toast);
      console.log(resp1);

    });

    // } else {
    //   this.toast("Fill all required fields", "error", 2000);
    // }
  }

  saveCustomSize(toast = true) {

    let obj = this.measurements.filter((item) => {
      return item._id == this.sizeObj.measurementId
    })
    this.measurementObj = obj;


    this.measurementObj["modifiedBy"] = null;

    this.measurementObj["isCreatedByAdmin"] = false;
    let measObj = {
      productId: this.productId,
      measurement: this.measurementObj,
    };
    console.log(measObj);
    const resp = this.productservice.storeMeasurment(measObj, this.productId, toast);
    console.log(resp);
  }

  productdetail() {
    this.loading = true;
    var getCart = JSON.parse(localStorage.getItem("cart"));
    if (getCart) {
      var x = getCart.findIndex((item) => item.id == this.productId);
      if (x != -1) {
        this.sizeObj.fit = getCart[x].size.fit != "" ? getCart[x].size.fit : "";
        this.sizeObj.sizeType =
          getCart[x].size.sizeType != "" ? getCart[x].size.sizeType : "";
        this.sizeApply =
          this.sizeObj.fit != "" && this.sizeObj.sizeType != "" ? true : false;
        this.sizeObj.measurementId = getCart[x].size.measurementId;
        this.sizeObj.measurementName = getCart[x].size.measurementName

      }
    }
    this.productservice.productdetail(this.productId).subscribe((data: any) => {
      if (data.message == "success") {
        // multiple images
        this.productImages = data.data.images;
        // prmary image
        this.productImages.push(data.data.image);
        this.specificproduct = data.data;
        this.specificproduct.images = this.specificproduct.images.reverse();
        this.selectedImage = this.specificproduct.images[0];
        console.log(this.specificproduct.images);
        if (data.data.categories) {
          this.productservice
            .suggestedProducts(data.data.categories, data.data._id)
            .subscribe((resp: any) => {
              if (resp.message == "success") {
                this.suggestedProducts = resp.data;
                this.loading = false;
              }
            });
        } else {
          this.loading = false;
        }
        this.addTag();
      }
    });
  }

  addToCart() {
    this.productservice.updateCart(this.sizeObj, this.productId, "addCart");
  }

  applySize() {
    if (this.disable) {
      this.errorForSizefield = false;
      this.sizeApply = true;
      document.getElementById("bttb").click();
      this.saveCustomSize();
      return;
    }
    if (this.sizeObj.fit == "" || this.sizeObj.sizeType == "") {
      this.errorForSizefield = true;
      this.toast.error("Please select size", "Message", {
        timeOut: 3000,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
      return;
    } else {
      this.errorForSizefield = false;
      this.sizeApply = true;
      document.getElementById("bttb").click();
      this.saveSize();
    }
  }

  customizeProduct(custome = false) {
    this.productservice.updateCart(
      this.sizeObj,
      this.productId,
      "go_customize_"
    );

    if (custome) {
      localStorage.setItem("customize", "true");
    }
    this.router.navigate(["/productcustomize/" + this.specificproduct._id]);
  }

  redirect(id) {
    // this.router.navigate(['/productdetail/' + id]);
    // this.productdetail();
    // this.getFavourite();
    // this.reviewOfProduct();
    // this.mySubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.router.navigated = false;
    //   }
    // });
    this.router.navigate(["/productdetail/" + id]);
    this.productservice.productdetail(id).subscribe((data: any) => {
      if (data.message == "success") {
        this.specificproduct = data.data;
        if (data.data.categories) {
          this.productservice
            .suggestedProducts(data.data.categories, data.data._id)
            .subscribe((resp: any) => {
              if (resp.message == "success") {
                this.suggestedProducts = resp.data;
                this.loading = false;
              }
            });
        } else {
          this.loading = false;
        }
      }
    });
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
    this.productservice
      .reviewOfProduct(this.productId)
      .subscribe((resp: any) => {
        this.reviews = resp.data;
        this.ratngPercentage = resp.rating;
      });
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  clickImage(item) {
    this.specificproduct.image = item;
  }

  /*Stop propogation*/
  openDropdown(e) {
    e.stopPropagation();
  }

  sizeTitle() {
    var ind = this.ext.sizeData
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.sizeObj.sizeType);
    if (ind != -1) {
      return this.ext.sizeData[ind].title;
    }
  }

  scroll(className) {
    document.getElementById("scrollId").click();
    const elementList = document.querySelectorAll("." + className);
    const element = elementList[0] as HTMLElement;
    element.scrollIntoView({ behavior: "smooth" });
  }
}
