import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { AttributeModel, AttributeValueModel } from "../interface/attribute.interface";

@Injectable({
  providedIn: "root",
})
export class AttributeService {

  constructor(private http: HttpClient) {}

  getAttributes(payload?: Params): Observable<AttributeModel> {
    // return this.http.get<AttributeModel>(`${environment.API_URL}/attribute.json`, { params: payload });
    return of()
  }

  getAttributeValues(payload?: Params): Observable<AttributeValueModel> {
    return of()
    // return this.http.get<AttributeValueModel>(`${environment.API_URL}/attribute-value.json`, { params: payload });
  }

}
