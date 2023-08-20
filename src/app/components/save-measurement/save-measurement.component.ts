import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../app.service";
import { ExtraService } from "../../Services/extra.service";
import { MeasurementService } from "../../Services/measurement.service";
import { UserService } from "../../Services/user.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-save-measurement",
  templateUrl: "./save-measurement.component.html",
  styleUrls: ["./save-measurement.component.scss"],
})
export class SaveMeasurementComponent implements OnInit {
  @Input() populateItem: any;
  @Output() close = new EventEmitter<void>();

  sizez: any[] = [];
  sizeLoader;
  measurement: any;
  videoUrl: SafeResourceUrl;
  ext = {
    sizeData: [],
    fitData: [],
  };

  form = {
    name: "",
    fit: "",
    size:""
  };

  loader = false;

  constructor(
    private extraSrv: ExtraService,
    private appService: AppService,
    private measurementService: MeasurementService,
    private userService: UserService,
    protected _sanitizer: DomSanitizer,
    private toat: ToastrService
  ) {}

  async ngOnInit() {
    this.loader = true;

    const item: any = await this.extraSrv
      .getAll_sizeExtras()
      .pipe(take(1))
      .toPromise();
      this.sizez = [];
      console.log({item});
      for (let i = 0; i < item.data.length; i++) {
        const key = this.makeKeyName(item.data[i].typ);
      this.sizez.push({
        key,
        typ: item.data[i].typ,
        Obj: item.data[i].video,
        selected: false,
        value: this.populateItem ? this.populateItem[key] : 0,
      });
    }
    console.log(this.sizez);

    const resp: any = await this.extraSrv.sizeType().pipe(take(1)).toPromise();
    // this.ext.sizeData = resp.sizeData;
    this.ext.fitData = resp.fitData;
    this.ext.sizeData=resp.sizeData


    this.form.name = this.populateItem ? this.populateItem.name : "";
    this.form.fit = this.populateItem
      ? this.populateItem.bodyType
      : resp.fitData[0].value;
      this.form.size = this.populateItem
      ? this.populateItem.bodyType
      : resp.sizeData[0].title;

    this.loader = false;
  }

  async save() {
    this.loader = true;

    if (!this.form.name || !this.form.fit || !this.form.size) {
      this.toat.error("Please fill all required fields", "Oops", {
        timeOut: 2000,
        positionClass: "toast-top-right",
        progressBar: true,
        progressAnimation: "increasing",
      });

      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const formObj = {
      name: this.form.name,
      bodyType: this.form.fit,
      sizeData:this.form.size,
      createdBy: loggedInUser._id,
      modifiedBy: loggedInUser._id,
      user: loggedInUser._id,
      owner: "60c86200156c8d53bc93c604", // admin id
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      accountNumber:
        loggedInUser.prefixAccountNumber + loggedInUser.postfixAccountNumber,
      stage: "0",
      comment: "",
      isCreatedByAdmin: false,
      chest: this.sizez.find((x) => x.key === "chest").value,
      waist: this.sizez.find((x) => x.key === "waist").value,
      hips: this.sizez.find((x) => x.key === "hips").value,
      biceps: this.sizez.find((x) => x.key === "biceps").value,
      shirtSize: this.sizez.find((x) => x.key === "shirtSize").value,
      collarSize: this.sizez.find((x) => x.key === "collarSize").value,
      shirtLength: this.sizez.find((x) => x.key === "shirtLength").value,
      sleeveLength: this.sizez.find((x) => x.key === "sleeveLength").value,
      Shoulders: this.sizez.find((x) => x.key === "Shoulders").value,
      CrossFront: this.sizez.find((x) => x.key === "CrossFront").value,
      CrossBack: this.sizez.find((x) => x.key === "CrossBack").value,
      ArmholeDepth: this.sizez.find((x) => x.key === "ArmholeDepth").value,
      SleeveCrownFront: "0",
      id: this.populateItem ? this.populateItem._id : "",
      type: "",
    };

    if (this.populateItem) {
      await this.measurementService.update(formObj).pipe(take(1)).toPromise();
    } else {
      await this.measurementService.create(formObj).pipe(take(1)).toPromise();
    }

    this.close.emit();
    this.loader = false;
  }

  defalt(val: any) {
    // if (!val) {
    //   this.sizez.forEach((size) => (size.value = 0));
    //   return;
    // }
    // this.sizeLoader = true;
    // this.extraSrv.Size_defaultValues(val).subscribe((resp: any) => {
    //   for (let o = 0; o < this.sizez.length; o++) {
    //     for (let j = 0; j < resp.data.values.length; j++) {
    //       if (
    //         this.sizez[o].typ == resp.data.values[j].extratype.typ &&
    //         this.sizeObj.fit == resp.data.values[j].shirtFit
    //       ) {
    //         this.sizez[o].value = resp.data.values[j].value;
    //       }
    //     }
    //   }
    //   this.sizeLoader = false;
    // });
  }

  // Open Modal
  open(content, options = {}, data) {
    if (data) document.getElementById(data).click();
    setTimeout(() => {
      this.appService.openModal(content, options);
    }, 100);
  }

  searchVideo(item) {
    this.measurement = item;
    if (this.measurement.Obj != undefined || this.measurement.Obj != null) {
      let url = "https://www.youtube.com/embed/" + this.measurement.Obj.videoId;
      this.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.videoUrl = "";
    }
  }

  // change Size of measurment like 0.5 (minus)
  minusValue(index) {
    if (this.sizez[index].value === 0) return;
    this.sizez[index].value = this.sizez[index].value - 0.5;
  }

  // change Size of measurment like 0.5 (PLus)
  plusValue(index) {
    this.sizez[index].value = Number(this.sizez[index].value) + 0.5;
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
}
