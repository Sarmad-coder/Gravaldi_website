import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MeasurementService {
  baseUrl = environment.baseUrl + "/measurement/";

  constructor(private http: HttpClient) {}

  getallByUser(userId: string) {
    return this.http.get(this.baseUrl + "getallByUser/" + userId);
  }

  getAll() {
    return this.http.get(this.baseUrl + "getall");
  }

  create(data) {
    return this.http.post(this.baseUrl + "create", data);
  }

  update(data) {
    return this.http.post(this.baseUrl + "update", data);
  }

  sendEmail(data) {
    return this.http.post(this.baseUrl + "sendEmail", data);
  }

  delete(id) {
    return this.http.delete(this.baseUrl + id);
  }

  getById(id) {
    return this.http.get(this.baseUrl + id);
  }

  getAllByAccountId(AcId) {
    return this.http.get(this.baseUrl + "/account/" + AcId);
  }

  getAllBypersonalId(pId) {
    return this.http.get(this.baseUrl + "PS/" + pId);
  }

  // Filter Sections

  // Personal Stylist On Change filter
  onPersonalStylistChange(data) {
    return this.http.post(this.baseUrl + "onPersonalStylistChange", data);
  }

  // StageOn Change filter
  onStageChange(data) {
    return this.http.post(this.baseUrl + "onStageChange", data);
  }

  // Rating On Change filter
  onfilter(data) {
    return this.http.post(this.baseUrl + "onfilter", data);
  }

  paging(data) {
    return this.http.post(this.baseUrl + "paging", data);
  }
}
