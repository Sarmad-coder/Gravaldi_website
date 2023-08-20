import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductsService } from "../../Services/products.service";
import { ExtraService } from "../../Services/extra.service";
import { environment } from "../../../environments/environment.prod";
import * as AOS from "aos";
@Component({
  selector: "app-productlist",
  templateUrl: "./productlist.component.html",
  styleUrls: ["./productlist.component.scss"],
})
export class ProductlistComponent implements OnInit {
  loading: Boolean = false;
  loadingbtn: Boolean = false;
  miniLoading = false;
  loading_secondary = false;
  stydrop = true;
  coldrop = false;
  patternDrop = false;
  fabricDrop = false;
  skipObj = {
    filter: "New Arrival",
    searchText: "",
    skip: 0,
    fabric: [],
    allfabric: true,
    style: [],
    allstyle: true,
    colors: [],
    allcolors: true,
    patterns: [],
    allpatterns: true,
    pageNumber: 0,
    perPage: 20,
  };
  baseUrl = environment.baseUrl;

  allProductList: any = [];
  dropdown = false;
  ProductFabrics = [];
  ProductStyles = [];
  ProductColors = [];
  ProductPatterns = [];
  paginationArray: any = [];
  paegsnum = 0;
  countPrdd = 0;

  constructor(
    private productservice: ProductsService,
    private _router: Router,
    private extraSrv: ExtraService
  ) {}

  ngOnInit() {
    AOS.init();
    this.loading = true;
    this.allproducts();
    this.extras();
  }

  // mouseover(item, i) {
  //   this.allProductList[i].abc = this.baseUrl + "/" + item.previewImage;
  // }

  // mouseout(item, i) {
  //   this.allProductList[i].abc = this.baseUrl + "/" + item.image;
  // }

  onScroll() {
    this.setPageNumber(this.skipObj.pageNumber + 1);
  }

  extras() {
    let t = {
      ProductFabrics: "Product Fabrics",
      ProductStyles: "Product Styles",
      ProductColors: "Product Colors",
      ProductPatterns: "Product Patterns",
    };
    this.extraSrv.extras_types(t).subscribe((resp: any) => {
      this.ProductFabrics = resp.Prodfabrics;
      this.ProductStyles = resp.Prodstyles;
      this.ProductColors = resp.Prodcolors;
      this.ProductPatterns = resp.Prodpatterns;
    });
  }

  allproducts() {
    this.productservice
      .getallProductslist(this.skipObj)
      .subscribe((data: any) => {
        console.log(data, "ye hein sara shop data");
        if (data.message == "success") {
          if (this.skipObj.pageNumber) {
            // load more
            this.allProductList.push(...data.data);
          } else {
            this.allProductList = data.data;
          }

          this.skipObj.skip = this.allProductList.length;
          this.countPrdd = data.count;
          this.paegsnum = Math.ceil(data.count / this.skipObj.perPage);
          this.storePaginationNumbers();
          this.loading = false;
          this.miniLoading = false;
          this.loading_secondary = false;
        }

        console.log(this.allProductList, "ye hein sari shop products");
      });
  }

  changePerPage(val) {
    this.skipObj.perPage = val;
    this.miniLoading = true;
    this.allproducts();
  }

  storePaginationNumbers() {
    this.paginationArray = [];
    if (this.skipObj.pageNumber - 2 >= 0) {
      this.paginationArray.push(this.skipObj.pageNumber - 2);
    }
    if (this.skipObj.pageNumber - 1 >= 0) {
      this.paginationArray.push(this.skipObj.pageNumber - 1);
    }
    if (this.skipObj.pageNumber >= 0) {
      this.paginationArray.push(this.skipObj.pageNumber);
    }
    if (this.skipObj.pageNumber + 1 < this.paegsnum) {
      this.paginationArray.push(this.skipObj.pageNumber + 1);
    }
    if (this.skipObj.pageNumber + 2 < this.paegsnum) {
      this.paginationArray.push(this.skipObj.pageNumber + 2);
    }
  }

  selectedproduct(id) {
    this._router.navigate(["/productcustomize/" + id]);
  }

  serachOnFilter() {
    this.skipObj.pageNumber = 0;
    this.loading_secondary = true;
    this.allproducts();
  }

  setPageNumber(val) {
    this.loading_secondary = true;
    if (
      !this.miniLoading &&
      this.skipObj.pageNumber != val &&
      val > -1 &&
      val < this.paegsnum
    ) {
      this.skipObj.pageNumber = val;
      this.allproducts();
    }
  }

  // Filters
  productStyle(val) {
    if (val == "All") {
      this.skipObj.style = [];
      this.skipObj.allstyle = !this.skipObj.allstyle;
      for (let i = 0; i < this.ProductStyles.length; i++) {
        this.ProductStyles[i].selected = this.skipObj.allstyle;
        this.skipObj.style.push(this.ProductStyles[i].obj.title);
      }
      if (!this.skipObj.allstyle) {
        this.skipObj.style = [];
        for (let i = 0; i < this.ProductStyles.length; i++) {
          this.ProductStyles[i].selected = this.skipObj.allstyle;
        }
      }
    } else {
      if (this.skipObj.style.length >= 1) {
        let found = false;
        let index;
        for (let i = 0; i < this.skipObj.style.length; i++) {
          if (
            this.skipObj.style[i] + "" ===
            this.ProductStyles[val].obj.title + ""
          ) {
            found = true;
            index = i;
            break;
          }
        }

        if (found) {
          this.ProductStyles[val].selected = !this.ProductStyles[val].selected;
          this.skipObj.style.splice(index, 1);
        } else {
          this.ProductStyles[val].selected = !this.ProductStyles[val].selected;
          this.skipObj.style.push(this.ProductStyles[val].obj.title);
        }
      } else {
        this.ProductStyles[val].selected = !this.ProductStyles[val].selected;
        this.skipObj.style.push(this.ProductStyles[val].obj.title);
      }
    }

    if (this.skipObj.style.length === 0) {
      this.skipObj.allstyle = true;
    } else {
      this.skipObj.allstyle = false;
    }
    this.serachOnFilter();
  }

  productColor(val) {
    if (val == "All") {
      this.skipObj.colors = [];
      this.skipObj.allcolors = !this.skipObj.allcolors;
      for (let i = 0; i < this.ProductColors.length; i++) {
        this.ProductColors[i].selected = this.skipObj.allcolors;
        this.skipObj.colors.push(this.ProductColors[i].obj.title);
      }
      if (!this.skipObj.allcolors) {
        this.skipObj.colors = [];
        for (let i = 0; i < this.ProductColors.length; i++) {
          this.ProductColors[i].selected = this.skipObj.allcolors;
        }
      }
    } else {
      if (this.skipObj.colors.length >= 1) {
        let found = false;
        let index;
        for (let i = 0; i < this.skipObj.colors.length; i++) {
          if (
            this.skipObj.colors[i] + "" ===
            this.ProductColors[val].obj.title + ""
          ) {
            found = true;
            index = i;
            break;
          }
        }

        if (found) {
          this.ProductColors[val].selected = !this.ProductColors[val].selected;
          this.skipObj.colors.splice(index, 1);
        } else {
          this.ProductColors[val].selected = !this.ProductColors[val].selected;
          this.skipObj.colors.push(this.ProductColors[val].obj.title);
        }
      } else {
        this.ProductColors[val].selected = !this.ProductColors[val].selected;
        this.skipObj.colors.push(this.ProductColors[val].obj.title);
      }
    }

    if (this.skipObj.colors.length === 0) {
      this.skipObj.allcolors = true;
    } else {
      this.skipObj.allcolors = false;
    }
    this.serachOnFilter();
  }

  productPatterns(val) {
    if (val == "All") {
      this.skipObj.patterns = [];
      this.skipObj.allpatterns = !this.skipObj.allpatterns;
      for (let i = 0; i < this.ProductPatterns.length; i++) {
        this.ProductPatterns[i].selected = this.skipObj.allpatterns;
        this.skipObj.patterns.push(this.ProductPatterns[i].obj.title);
      }
      if (!this.skipObj.allpatterns) {
        this.skipObj.patterns = [];
        for (let i = 0; i < this.ProductPatterns.length; i++) {
          this.ProductPatterns[i].selected = this.skipObj.allpatterns;
        }
      }
    } else {
      if (this.skipObj.patterns.length >= 1) {
        let found = false;
        let index;
        for (let i = 0; i < this.skipObj.patterns.length; i++) {
          if (
            this.skipObj.patterns[i] + "" ===
            this.ProductPatterns[val].obj.title + ""
          ) {
            found = true;
            index = i;
            break;
          }
        }

        if (found) {
          this.ProductPatterns[val].selected =
            !this.ProductPatterns[val].selected;
          this.skipObj.patterns.splice(index, 1);
        } else {
          this.ProductPatterns[val].selected =
            !this.ProductPatterns[val].selected;
          this.skipObj.patterns.push(this.ProductPatterns[val].obj.title);
        }
      } else {
        this.ProductPatterns[val].selected =
          !this.ProductPatterns[val].selected;
        this.skipObj.patterns.push(this.ProductPatterns[val].obj.title);
      }
    }

    if (this.skipObj.patterns.length === 0) {
      this.skipObj.allpatterns = true;
    } else {
      this.skipObj.allpatterns = false;
    }
    this.serachOnFilter();
  }

  productFabrics(val) {
    if (val == "All") {
      this.skipObj.fabric = [];
      this.skipObj.allfabric = !this.skipObj.allfabric;
      for (let i = 0; i < this.ProductFabrics.length; i++) {
        this.ProductFabrics[i].selected = this.skipObj.allfabric;
        this.skipObj.fabric.push(this.ProductFabrics[i].obj.title);
      }
      if (!this.skipObj.allfabric) {
        this.skipObj.fabric = [];
        for (let i = 0; i < this.ProductFabrics.length; i++) {
          this.ProductFabrics[i].selected = this.skipObj.allfabric;
        }
      }
    } else {
      if (this.skipObj.fabric.length >= 1) {
        let found = false;
        let index;
        for (let i = 0; i < this.skipObj.fabric.length; i++) {
          if (
            this.skipObj.fabric[i] + "" ===
            this.ProductFabrics[val].obj.title + ""
          ) {
            found = true;
            index = i;
            break;
          }
        }

        if (found) {
          this.ProductFabrics[val].selected =
            !this.ProductFabrics[val].selected;
          this.skipObj.fabric.splice(index, 1);
        } else {
          this.ProductFabrics[val].selected =
            !this.ProductFabrics[val].selected;
          this.skipObj.fabric.push(this.ProductFabrics[val].obj.title);
        }
      } else {
        this.ProductFabrics[val].selected = !this.ProductFabrics[val].selected;
        this.skipObj.fabric.push(this.ProductFabrics[val].obj.title);
      }
    }
    if (this.skipObj.fabric.length == 0) {
      this.skipObj.allfabric = true;
    } else {
      this.skipObj.allfabric = false;
    }
    this.serachOnFilter();
  }

  setFalse(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].selected = false;
    }
  }

  remove_filter(val, index) {
    if (val == "style") {
      let y = this.ProductStyles.findIndex(
        (i) => i.obj.title === this.skipObj.style[index]
      );
      if (y != -1) {
        this.ProductStyles[index].selected =
          !this.ProductStyles[index].selected;
      }
      this.skipObj.style.splice(index, 1);
    } else if (val == "fabric") {
      let y = this.ProductFabrics.findIndex(
        (i) => i.obj.title === this.skipObj.fabric[index]
      );
      if (y != -1) {
        this.ProductFabrics[index].selected =
          !this.ProductFabrics[index].selected;
      }
      this.skipObj.fabric.splice(index, 1);
    } else if (val == "patterns") {
      let y = this.ProductPatterns.findIndex(
        (i) => i.obj.title === this.skipObj.patterns[index]
      );
      if (y != -1) {
        this.ProductPatterns[index].selected =
          !this.ProductPatterns[index].selected;
      }
      this.skipObj.patterns.splice(index, 1);
    } else if (val == "colors") {
      let y = this.ProductColors.findIndex(
        (i) => i.obj.title === this.skipObj.colors[index]
      );
      if (y != -1) {
        this.ProductColors[index].selected =
          !this.ProductColors[index].selected;
      }
      this.skipObj.colors.splice(index, 1);
    }
    this.serachOnFilter();
  }

  clearShow() {
    if (
      this.skipObj.style.length > 0 ||
      this.skipObj.fabric.length > 0 ||
      this.skipObj.colors.length > 0 ||
      this.skipObj.patterns.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  clearAll() {
    this.ngOnInit();
    this.skipObj.colors = [];
    this.skipObj.style = [];
    this.skipObj.patterns = [];
    this.skipObj.fabric = [];
    this.extras();
  }
  fabricPage(e) {
    console.log(e);
  }
}
