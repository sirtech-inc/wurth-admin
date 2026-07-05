import { ContentType, ResponseType } from "@shared/types/util.types";
import { HideButtonSpinnerAction, HideLoaderAction, ResetLoaderStateAction } from "@shared/action/loader.action";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  IResponseResult,
  IResponseStructure,
  ResponseModel,
} from "@shared/interface";
import { Observable, catchError, delay, map, of } from "rxjs";

import { Injectable } from "@angular/core";
import { NotificationService } from "@shared/services/index.service";
import { Store } from "@ngxs/store";

@Injectable({
  providedIn: "root",
})
export class ApiCoreService {
  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService,
    private store: Store
  ) { }

  get<T>(path: string, params: HttpParams, headers?: HttpHeaders, _responseType?: ResponseType): Observable<IResponseStructure>;
  get<T>(path: string, params: HttpParams, headers?: {}, _responseType?: ResponseType): Observable<IResponseStructure>;
  get<T>(path: string, params: {}, headers?: {}, _responseType?: ResponseType): Observable<IResponseStructure> {
    return this.httpClient
      .get<IResponseStructure>(path, {
        params,
        headers: headers ? headers : {},
        responseType: _responseType as "json",
      })
      .pipe(
        catchError((error) => {
          this.showError(error?.status);
          return of(error);
        }),
        map((data) => this.checkData(data))
      );
  }

  post<T>(path: string, body: T): Observable<IResponseStructure>;
  post<T>(path: string, body: T, params?: {}, headers?: {}): Observable<IResponseStructure>;
  post<T>(path: string, body: T, params?: HttpParams, headers?: HttpHeaders): Observable<IResponseStructure> {
    return this.httpClient
      .post<IResponseStructure>(path, body, { params, headers : headers ? headers : {} })

      .pipe(
        catchError((error) => {
          this.showError(error?.status);
          return of(error);
        }),
        map((data) => this.checkData(data))
      );
  }

  put<T>(path: string, body: T): Observable<IResponseStructure>;
  put<T>(path: string, body: T, params?: {}, headers?: {}): Observable<IResponseStructure>;
  put<T>(path: string, body: T, params?: HttpParams, headers?: HttpHeaders): Observable<IResponseStructure> {
    return this.httpClient
      .put<IResponseStructure>(path, body, { headers, params })
      .pipe(
        catchError((error) => {
          this.showError(error?.status);
          return of(error);
        }),
        map((data) => this.checkData(data))
      );
  }

  private checkData<T>(data) {
    if (data && data.result && data.result["status"] === 200 && data.datos) {
      return data;
    }

    const result = data as ResponseModel<T>;
    if (result?.result?.detail) {
      let message = result.result.detail;
      setTimeout(() => {
        this.store.dispatch(new HideLoaderAction())
        this.store.dispatch(new ResetLoaderStateAction());

      },500)
      this.notificationService.showError(message, `Error ${result.result.status}`);

    }

    return null;
  }

  public httpParams(extraParams: object = {}): HttpParams {
    let params = new HttpParams();
    Object.keys(extraParams).forEach((key) => {
      if (extraParams[key]) {
        params = params.append(key, extraParams[key]);
      }
    });
    return params;
  }

  private showError(status: number) {
    switch (status) {
      case 400: this.notificationService.showError(`La solicitud no es válida`, `Error ${status}`); break;
      case 401: this.notificationService.showError("El recurso solicitado no está autorizado", `Error ${status}`); break;
      case 404: this.notificationService.showError("No se encontró el recurso solicitado", `Error ${status}`); break;
      case 500: this.notificationService.showError("Se ha encontrado un problema en el servidor", `Error ${status}`); break;
      default: this.notificationService.showError(`Error desconocido con error de respuesta`, `Error ${status}`); break;
    }

    setTimeout( () => {
      this.store.dispatch(new HideLoaderAction())
      this.store.dispatch(new ResetLoaderStateAction());
    },100)


  }

  public httpHeader(
    extraHeader: object = {},
    contentType?: ContentType
  ): Object {
    contentType = !contentType ? "application/json" : contentType;
    const headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
      "Content-Type": contentType ,
      ...extraHeader,
    });
    return headers;
  }
}
