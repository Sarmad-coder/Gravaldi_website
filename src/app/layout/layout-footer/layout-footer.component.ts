import { Component, ElementRef, HostBinding, ViewChild } from "@angular/core";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";
import { SubscribeService } from "../../Services/subscribe.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-layout-footer",
  templateUrl: "./layout-footer.component.html",
  styleUrls: ["./layout-footer.component.scss"],
})
export class LayoutFooterComponent {
  @ViewChild("iframe") iframe: ElementRef;
  @HostBinding("class.layout-footer") private hostClassMain = true;
  navbarcolor = "home";
  currenturl = false;
  subscribeObj = {
    email: "",
  };

  constructor(
    private appService: AppService,
    private subSrv: SubscribeService,
    private toster: ToastrService,
    private router: Router
  ) {
    // productcustomize
    let checkP = this.router.url.indexOf("/productcustomize/");
    this.currenturl = checkP != -1 ? true : false;
  }

  currentBg() {
    return `bg-${this.appService.layoutFooterBg}`;
  }

  toggleColor() {
    this.navbarcolor = "home";
  }

  submit() {
    if (this.subscribeObj.email.trim() == "") {
      this.toster.error("Please fill the field", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    } else {
      var check = this.validateEmail(this.subscribeObj.email);
      if (check) {
        this.subSrv.create(this.subscribeObj).subscribe((resp: any) => {
          if (resp.message == "success") {
            this.toster.success("Successfully Registerd", "", {
              timeOut: 2000,
              positionClass: "toast-bottom-right",
              progressBar: true,
              progressAnimation: "increasing",
            });
            this.subscribeObj.email = "";
          } else if (resp.message == "already") {
            this.toster.error("Email is already exist", "", {
              timeOut: 2000,
              positionClass: "toast-bottom-right",
              progressBar: true,
              progressAnimation: "increasing",
            });
          } else {
            console.log("something went wrong");
          }
        });
      } else {
        this.toster.error("Email is not Correct", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
      }
    }
  }

  validateEmail(emailAdress) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
      return true;
    } else {
      return false;
    }
  }
}
