import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../app.service";
import { CountryService } from "../../Services/country.service";
import { UserService } from "../../Services/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  superAdmin = "60c86200156c8d53bc93c604";
  signupObj = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    modifiedBy: this.superAdmin,
    accountOwner: this.superAdmin,
    prefixAccountNumber: "",
    postfixAccountNumber: "",
    company: "",
    position: "",
    website: "",
    phone: "",
    phoneOffice: "",
    fax: "",
    social: {
      facebook: "",
      instagram: "",
      twitter: "",
      pintrest: "",
    },
    source: "",
    reffered: this.superAdmin,
    comment: "",
    work: {
      address: "",
      building: "",
      floor: "",
      street: "",
      area: "",
      city: "",
      zip: "",
      country: "",
    },
    house: {
      address: "",
      building: "",
      floor: "",
      street: "",
      area: "",
      city: "",
      zip: "",
      country: "",
    },
    seconday: {
      address: "",
      city: "",
      zip: "",
      country: "",
    },
    appoinmentRequest: {
      location: "",
      date: "",
      id: "",
    },
    copyFrom: "",
    role: null,
    status: "",
    rating: "",
    isCreatedByAdmin: true,
    isSecondary: false,
    isCompany: false,
    isappoinment: true,
    isAdmin: false,
    isPersonal: false,
    isLead: false,
    id: "",
  };

  signupInvalidPassword = false;
  signUpShowPass = false;
  loggedInUser: any;
  countries: any;

  constructor(
    private appService: AppService,
    private userSrv: UserService,
    private router: Router,
    private toster: ToastrService,
    private countrySrv: CountryService
  ) {
    this.appService.pageTitle = "Register";
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));

    this.countrySrv.getAll().subscribe((resp: any) => {
      this.countries = resp.data;
      this.signupObj.house.country =
        resp.data.length > 0 ? resp.data[0].country._id : "0";
    });
  }

  ngOnInit() {
  }

  signup() {
    const data = {
      firstName: this.signupObj.firstName,
      lastName: this.signupObj.lastName,
      username: "",
      email: this.signupObj.email.trim().toLowerCase(),
      password: this.signupObj.password.trim(),
      modifiedBy: this.superAdmin,
      accountOwner: this.superAdmin,
      prefixAccountNumber: "",
      postfixAccountNumber: "",
      company: "",
      position: "",
      website: "",
      phone: "",
      phoneOffice: "",
      fax: "",
      social: {
        facebook: "",
        instagram: "",
        twitter: "",
        pintrest: "",
      },
      source: "",
      reffered: this.superAdmin,
      comment: "",
      work: {
        address: "",
        building: "",
        floor: "",
        street: "",
        area: "",
        city: "",
        zip: "",
        country: "",
      },
      house: {
        address: "",
        building: "",
        floor: "",
        street: "",
        area: "",
        city: "",
        zip: "",
        country: this.signupObj.house.country,
      },
      seconday: {
        address: "",
        city: "",
        zip: "",
        country: "",
      },
      appoinmentRequest: {
        location: "",
        date: "",
        id: "",
      },
      copyFrom: "",
      role: null,
      status: "",
      rating: "",
      isCreatedByAdmin: false,
      isSecondary: false,
      isCompany: false,
      isappoinment: true,
      isPersonal: false,
      isLead: false,
      isAdmin: false,
    };

    if (
      !this.signupObj.house.country ||
      !this.signupObj.email.trim() ||
      !this.signupObj.password.trim()
    ) {
      this.toster.error("Please fill all fields", "", {
        timeOut: 2000,
        positionClass: "toast-bottom-right",
        progressBar: true,
        progressAnimation: "increasing",
      });

      return;
    }

    if (data.password.length < 6) {
      this.signupInvalidPassword = true;
      return;
    }

    this.userSrv.singup(data).subscribe((resp: any) => {
      if (resp.message == "success") {
        localStorage.setItem("user", JSON.stringify(resp.data));
        localStorage.setItem("token", JSON.stringify(resp.token));
        // document.getElementById("c_m2").click();
        this.loggedInUser = JSON.parse(localStorage.getItem("user"));
        this.toster.success("Successfully Registerd", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
        this.signupInvalidPassword = false;
        if (localStorage.getItem('redirect')) {
          var url = localStorage.getItem('redirect');
          localStorage.removeItem('redirect');
          window.location.href = url + "?moveToSizes=1";
        } else {
          window.location.reload();
        }
        
      } else if (resp.message == "already") {
        this.toster.error("Email is already exist", "", {
          timeOut: 2000,
          positionClass: "toast-bottom-right",
          progressBar: true,
          progressAnimation: "increasing",
        });
        this.signupInvalidPassword = false;
      }
    });
  }
}
