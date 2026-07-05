import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { CreateUser, EditUser, GetUsers, UpdateUser } from "../action/user.action";
import { HideButtonSpinnerAction, HideLoaderAction, ResetLoaderStateAction, ShowLoaderAction } from "@shared/action";
import { User, UserModel } from "../interface/user.interface";

import { Injectable } from "@angular/core";
import { LoaderState } from "./loader.state";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { tap } from "rxjs";

export class UserStateModel {
  user = {
    datos: [] as User[],
    total: 0
  }
  selectedUser: User | null;
}

@State<UserStateModel>({
  name: "user",
  defaults: {
    user: {
      datos: [],
      total: 0
    },
    selectedUser: null
  },
})
@Injectable()
export class UserState {

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router,
  ) { }

  @Selector()
  static user(state: UserStateModel) {
    return state.user;
  }

  @Selector()
  static users(state: UserStateModel) {
    return state.user.datos.map(user => {
      return { label: user?.name, value: user?.code }
    });
  }

  @Selector()
  static selectedUser(state: UserStateModel) {
    return state.selectedUser;
  }

  @Action(GetUsers)
  getUsers(ctx: StateContext<UserStateModel>, action: GetUsers) {
    return this.userService.getUsers(action?.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            user: {
              datos: result.datos.datos,
              total: result.datos.count
            }
          });
        },
        error: err => {

          if(err?.error?.message){
            throw new Error(err?.error?.message);
          }
        }
      })
    );
  }


  @Action(EditUser)
  edit(ctx: StateContext<UserStateModel>, { id }: EditUser) {
    return this.userService.getUserById(id).pipe(
      tap({
        next: result => {

          if(result.datos === null && result.datos === null){
            this.store.dispatch(new ResetLoaderStateAction())
            this.router.navigate(['/user']);
            throw new Error();
          }

          ctx.patchState({
            ...ctx.getState(),
            selectedUser: result.datos
          });
        },
        error: err => {
          this.store.dispatch(new HideLoaderAction())
          this.router.navigate(['/user']);
          if(err?.error?.message){
            throw new Error(err?.error?.message);
          }
          
        }
      })
    )
  }


  @Action(UpdateUser)
  update(ctx: StateContext<UserStateModel>, { payload, id }: UpdateUser) {
    return this.userService.updateUser(id, payload).pipe(
      tap({
        next: result => {
          if (result.datos === null && result.result === null) {
            this.store.dispatch( new ResetLoaderStateAction() )
            throw new Error();
          }
          ctx.patchState({
            user: {
              datos: ctx.getState().user.datos.map(user => user.code === id ? result.datos : user),
              total: ctx.getState().user.total
            }
          });
          this.notificationService.showSuccess(result.result.detail);
        },
        error: err => {
          this.store.dispatch( new ResetLoaderStateAction() )
          this.router.navigate(['/user']);
          if(err?.error?.message){
            throw new Error(err?.error?.message);
          }
        }
      })
    )
  }

  @Action(CreateUser)
  create(ctx: StateContext<UserStateModel>, { payload }: CreateUser) {
    return this.userService.createUser(payload).pipe(
      tap({
        next: result => {
          if (result.datos === null && result.result === null) {
            this.store.dispatch( new ResetLoaderStateAction() )
            throw new Error();
          }
          ctx.patchState({
            user: {
              datos: [...ctx.getState().user.datos, result.datos],
              total: ctx.getState().user.total + 1
            }
          });

          this.notificationService.showSuccess(result.result.detail);
        },
        error: err => {
          this.store.dispatch( new ResetLoaderStateAction() )
          this.router.navigate(['/user']);
          if(err?.error?.message){
            throw new Error(err?.error?.message);
          }
        }
      })
    )
  }
  



}
