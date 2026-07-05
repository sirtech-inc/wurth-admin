import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthResponse, AuthUserStateModel, UserResponse } from "../interface/auth.interface";
import { Observable, filter, map, of } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient) { }

   LoginUsuario(auth: AuthUserStateModel): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.API_URL}/User/login`,auth);
  }
}
