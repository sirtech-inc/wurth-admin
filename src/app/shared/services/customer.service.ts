import {
  AddressDto,
  Customer,
  CustomerData,
  IResponseResult,
  IResponseStructure,
  ResponseModel,
} from "@shared/interface";
import { Observable, catchError, map, throwError } from "rxjs";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { Injectable } from "@angular/core";
import { Params } from "../interface/core.interface";
import { environment } from "../../../environments/environment";
import { OptionalAll } from "@shared/types/util.types";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
    providedIn: "root",
  })
export class CustomerService {
    constructor(
    private apiCoreService: ApiCoreService) {}


  getCustomer(payload: Params): Observable<ResponseModel<CustomerData>> {
      const api = `${environment.API_URL}/Customer/ListadoGeneral`;
      return this.apiCoreService
        .get<ResponseModel<CustomerData>>(
          api,
          this.apiCoreService.httpParams(payload),
          this.apiCoreService.httpHeader()
        )
        .pipe(
          map((response: IResponseStructure) => {
            const responseApi: ResponseModel<CustomerData> = {
              datos: (response?.datos as CustomerData) ?? null,
              result: (response?.result as IResponseResult) ?? null,
            };
            return responseApi;
          })
        );
    }

  createCustomer(
        payload: OptionalAll<Customer>
      ): Observable<ResponseModel<Customer>> {
        const form: Customer =  {
          ...payload,
          email: payload.email,
          password: payload.password,
          type: payload.type,
          document_number: payload.document_number,
          name: payload.name,
          lastname: payload.lastname,
          company_name: payload.company_name,
          division: "auto",
          deal: payload.deal,
          phone: "999999999"
        }


        return this.apiCoreService
          .post(`${environment.API_URL}/Auth/Register/${payload.eccomerce.toLocaleLowerCase()}`, form)
          .pipe(
            map((response: IResponseStructure) => {
              const responseApi: ResponseModel<Customer> = {
                datos: (response?.datos as Customer) ?? null,
                result: (response?.result as IResponseResult) ?? null,
              };
              return responseApi;
            }),
            catchError((error: HttpErrorResponse) => {
              return throwError(() => error);
            })
          );
    }

  updateCustomer(
      id: number,
      payload: OptionalAll<Customer>
    ): Observable<ResponseModel<Customer>> {
      return this.apiCoreService
        .put(`${environment.API_URL}/Customer/update/${id}`, payload)
        .pipe(
          map((response: IResponseStructure) => {
            const responseApi: ResponseModel<Customer> = {
              datos: (response?.datos as Customer) ?? null,
              result: (response?.result as IResponseResult) ?? null,
            };
            return responseApi;
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        );
    }

  getCustomerById(payload: number): Observable<ResponseModel<Customer>> {
      return this.apiCoreService
        .get<ResponseModel<Customer>>(
          `${environment.API_URL}/Customer/${payload}`,
          this.apiCoreService.httpParams(),
          this.apiCoreService.httpHeader()
        )
        .pipe(
          map((response: IResponseStructure) => {
            const responseApi: ResponseModel<Customer> = {
              datos: (response?.datos as Customer) ?? null,
              result: (response?.result as IResponseResult) ?? null,
            };
            return responseApi;
          })
        );
    }

getAndrees(code: number): Observable<ResponseModel<AddressDto[]>> {
  const api = `${environment.API_URL}/Addresses_User/${code}`; 
  return this.apiCoreService
    .get<ResponseModel<AddressDto[]>>(
      api,
      this.apiCoreService.httpParams(),
      this.apiCoreService.httpHeader()
    )
    .pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<AddressDto[]> = {
          datos: (response?.datos as AddressDto[]),
          result: (response?.result as IResponseResult) ?? null,
        };
        return responseApi;
      })
    );
}

getUserAddresses(userCode: number): Observable<ResponseModel<AddressDto[]>> {
  const api = `${environment.API_URL}/Customer/Addresses_User/${userCode}`; 
  return this.apiCoreService
    .get<ResponseModel<AddressDto[]>>(
      api,
      this.apiCoreService.httpParams(),
      this.apiCoreService.httpHeader()
    )
    .pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<AddressDto[]> = {
          datos: Array.isArray(response?.datos) ? response.datos as AddressDto[] : [],
          result: (response?.result as IResponseResult) ?? null,
        };
        return responseApi;
      })
    );
}


}