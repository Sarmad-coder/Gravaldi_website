import { Component, Input, HostBinding,OnInit } from "@angular/core";
import { AppService } from "../../app.service";
import { LayoutService } from "../../layout/layout.service";
import { ProductsService } from "../../Services/products.service";

@Component({
  selector: "app-layout-navbar",
  templateUrl: "./layout-navbar.component.html",
  styleUrls: ["./layout-navbar.component.scss"],
})
export class LayoutNavbarComponent implements OnInit{
  isExpanded1 = false;

  isRTL: boolean;
  routeName: any;
  cartItems: any;
  closeMenu = true;
  loggedInUser: any;
  optConfig = {
    length: 4,
    allowNumbersOnly: true,
    inputClass: "otp-input",
    inputStyles: { width: "60px", height: "60px", padding: 0 },
  };


  @Input() sidenavToggle = true;
  @HostBinding("class.layout-navbar") private hostClassMain = true;

  constructor(
    private appService: AppService,
    private layoutService: LayoutService,
    public prodSrv: ProductsService
  ) {
    this.cartItems = this.prodSrv.cartItems;
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));

    this.isRTL = appService.isRTL;
    // this.route.url.subscribe((url) => {
    //   this.routeName = url[0].path == "home" ? "home" : "otherthanhome";
    // });

    
  }
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
  }

  toggleMenu() {
    this.closeMenu = !this.closeMenu;
    document.getElementsByTagName("html").item(0).style.overflow = this
      .closeMenu
      ? "auto"
      : "hidden";
  }

  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }

  open1(content, options = {}, data) {
    if (data) document.getElementById(data).click();
    setTimeout(() => {
      this.appService.openModal(content, options);
    }, 100);
  }

  // openAuthModel() {
  //   document.getElementById("openAuthModel").click();
  // }
}
