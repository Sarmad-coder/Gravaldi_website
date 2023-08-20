import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../app.service";
import { NotificationService } from "../../Services/notification.service";
import { UserService } from "../../Services/user.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  forgetPassword = {
    email: "",
  };

  passwordObj = {
    password: "",
    newpassword: "",
    id: "",
  };

  verifyCode = false;
  newPassword = false;

  signInInvalidPassword = false;
  signInShowPass = false;
  loggedInUser: any;
  enteredCode = "";
  interTmer: any;
  loaDer = false;
  code: any;
  exitCondition = 90;

  constructor(
    private appService: AppService,
    private userSrv: UserService,
    private router: Router,
    private toster: ToastrService,
    private notifiSrv: NotificationService
  ) {
    this.appService.pageTitle = "Login";
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {}

  passwordReset() {
    if (this.passwordObj.password == "" || this.passwordObj.newpassword == "") {
      this.toster.success("Password Updated", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
    } else {
      if (this.passwordObj.password !== this.passwordObj.newpassword) {
        this.toster.error("Password is not matched", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
      } else {
        this.userSrv.updatePassword(this.passwordObj).subscribe((resp: any) => {
          if (resp.message == "success") {
            document.getElementById("c_m3").click();
            localStorage.setItem("user", JSON.stringify(resp.data));
            localStorage.setItem("token", JSON.stringify(resp.token));
            this.router.navigate(["/account"]);

            this.toster.success("Password updated", "", {
              timeOut: 2000,
              positionClass: "toast-bottom-right",
              progressBar: true,
              progressAnimation: "increasing",
            });
          }
        });
      }
    }
  }

  onOtpChange(e) {
    this.enteredCode = e;

    if (e.length == 4) {
      this.verify();
    }
  }

  verify() {
    if (this.enteredCode.length == 4) {
      if (this.enteredCode == this.code) {
        this.loaDer = true;
        clearInterval(this.interTmer);
        this.newPassword = true;
        this.verifyCode = false;
      } else {
        this.loaDer = false;
        this.toster.error("Invalid Code", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
      }
    }
  }

  reset() {
    var checkEmail = this.validateEmail(this.forgetPassword.email);
    if (!checkEmail) {
      this.toster.error("Email is invalid", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });
      return;
    }

    this.notifiSrv.create(this.forgetPassword).subscribe((resp: any) => {
      if (resp.message == "no exist") {
        this.toster.error("Email is not exist", "Try again", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
      } else if (resp.message == "success") {
        this.verifyCode = true;
        this.code = resp.code;
        this.passwordObj.id = resp.data._id;
        this.toster.success("Verify Your Account By Email", "OTP sent", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
        this.startTimer();
      }
    });
  }

  validateEmail(emailAdress) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
      return true;
    } else {
      return false;
    }
  }

  startTimer() {
    this.exitCondition = 90;
    this.interTmer = setInterval(() => {
      this.exitCondition--;
      if (this.exitCondition <= 0 || this.exitCondition == 0) {
        clearInterval(this.interTmer);
        this.exitCondition = 0;
        this.code = null;
      }
    }, 1000);
  }
}
