import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../app.service";
import { UserService } from "../../Services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginObj = {
    email: "",
    password: "",
  };

  signInInvalidPassword = false;
  signInShowPass = false;
  loggedInUser: any;

  constructor(
    private appService: AppService,
    private userSrv: UserService,
    private router: Router,
    private toster: ToastrService
  ) {
    this.appService.pageTitle = "Login";
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {}

  login() {
    const data = {
      email: this.loginObj.email.trim().toLowerCase(),
      password: this.loginObj.password.trim(),
    };

    if (!this.loginObj.email.trim() || !this.loginObj.password.trim()) {
      this.toster.error("Please fill all fields", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });

      return;
    }

    if (data.password.length < 6) {
      this.signInInvalidPassword = true;

      return;
    }

    this.userSrv.signin(data).subscribe((resp: any) => {
      if (resp.message == "success") {
        localStorage.setItem("user", JSON.stringify(resp.data));
        localStorage.setItem("token", JSON.stringify(resp.token));
        // document.getElementById("c_m1").click();
        this.loggedInUser = JSON.parse(localStorage.getItem("user"));

        this.toster.success("Successfully loggedIn", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });

        this.signInInvalidPassword = false;
        if (localStorage.getItem('redirect')) {
          var url = localStorage.getItem('redirect');
          localStorage.removeItem('redirect');
          window.location.href = url + "?moveToSizes=1";
        } else {
          window.location.reload();
        }
      } else if (resp.message == "Un Authorized") {
        this.toster.error("Login Credentials is Invalid", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });

        this.signInInvalidPassword = false;
      }
    });
  }
}
