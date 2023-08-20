import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { OrderService } from "./Services/order.service";

@Pipe({
  name: "fetchMeasurement",
})
export class FetchMeasurementPipe implements PipeTransform {
  constructor(private ordSrv: OrderService,private _sanitizer: DomSanitizer) {}
  transform(value: any, args?: any): SafeHtml {
    return new Promise((resolve, reject) => {
      this.ordSrv.getMeasurByNumber(value).subscribe((resp: any) => {
        var m = resp.data
        var html = `
        <h5><b>Measurement Number:</b> ${m.prefixAccountNumber}${m.postfixAccountNumber}</h5><br>
        <button class="btn mb-1"><b>Collar Size:</b> ${m.collarSize}</button>
        <button class="btn mb-1"><b>Chest:</b> ${m.chest}</button>
        <button class="btn mb-1"><b>Waist:</b> ${m.waist}</button>
        <button class="btn mb-1"><b>Sleeve Length:</b> ${m.sleeveLength}</button>
        <button class="btn mb-1"><b>Shirt Length:</b> ${m.shirtLength}</button>
        <button class="btn mb-1"><b>Shirt Size:</b> ${m.shirtSize}</button>
        <button class="btn mb-1"><b>Biceps:</b> ${m.biceps}</button>
        <button class="btn mb-1"><b>Hips:</b> ${m.hips}</button>
        <button class="btn mb-1"><b>Shoulders:</b> ${m.Shoulders}</button>
        <button class="btn mb-1"><b>Crossfront:</b> ${m.CrossFront}</button>
        <button class="btn mb-1"><b>Crossback:</b> ${m.CrossBack}</button>
        <button class="btn mb-1"><b>Armhole Depth:</b> ${m.ArmholeDepth}</button>
        `;
        resolve(this._sanitizer.bypassSecurityTrustHtml(html))
      })
    });
  }
}
