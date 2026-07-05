import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../services/notification.service";
// import { AuthResponse } from "../interface/auth.interface";
import { Login, Logout } from "../action/auth.action";
import { AuthStateModel } from "../interface/auth.interface";

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    email: '',
    token: '',
    name: ''
  },
})
@Injectable()
export class AuthState {

  constructor(private store: Store,
    public router: Router,
    private notificationService: NotificationService,
    private authService: AuthService) { }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.token;
  }

  @Selector()
  static email(state: AuthStateModel) {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    // logica para el login con el servicio
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    // logica para el login con el servicio
  }

}
