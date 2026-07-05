import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Customer } from "../interface";
import { NotificationService } from "../services/notification.service";
import { CustomerService } from "../services/customer.service";
import { CreateCustomer, EditCustomer, GetCustomers, UpdateCustomer } from "@shared/action/customer.action";
import { tap } from "rxjs";
import { Router } from "@angular/router";
import { HideLoaderAction, ResetLoaderStateAction } from "@shared/action";


export class CustomerStateModel {
  customer = {
    datos: [] as Customer[],
    total: 0
  }
  selectedCustomer: Customer | null;
}



@State<CustomerStateModel>({
  name: "customer",
  defaults: {
    customer: {
      datos: [],
      total: 0
    },
    selectedCustomer: null,
  },
})
@Injectable()
export class CustomerState {

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private router: Router,
  ) { }

    @Selector()
    static customer(state: CustomerStateModel) {
      return state.customer;
    }

    @Selector()
    static custo(state: CustomerStateModel) {
      return state.customer.datos.map(custome => {
        return { label: custome?.name, value: custome?.code }
      });
    }
    @Selector()
      static selectedCustomer(state: CustomerStateModel) {
        return state.selectedCustomer;
      }
    // @Selector()
    // static selectedUser(state: CustomerStateModel) {
    //   return state.selectedCustomer;
    // }

    @Action(GetCustomers)
    getCustomer(ctx: StateContext<CustomerStateModel>, action: GetCustomers) {
      return this.customerService.getCustomer(action?.payload).pipe(
        tap({
          next: result => {
            ctx.patchState({
              customer: {
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


    @Action(EditCustomer)
      edit(ctx: StateContext<CustomerStateModel>, { id }: EditCustomer) {
        return this.customerService.getCustomerById(id).pipe(
          tap({
            next: result => {
    
              if(result.datos === null && result.datos === null){
                this.store.dispatch(new ResetLoaderStateAction())
                this.router.navigate(['/customers']);
                throw new Error();
              }
    
              ctx.patchState({
                ...ctx.getState(),
                selectedCustomer: result.datos
              });
            },
            error: err => {
              this.store.dispatch(new HideLoaderAction())
              this.router.navigate(['/customers']);
              if(err?.error?.message){
                throw new Error(err?.error?.message);
              }
              
            }
          })
        )
      }
    
    
      @Action(UpdateCustomer)
      update(ctx: StateContext<CustomerStateModel>, { payload, id }: UpdateCustomer) {
        return this.customerService.updateCustomer(id, payload).pipe(
          tap({
            next: result => {
              if (result.datos === null && result.result === null) {
                this.store.dispatch( new ResetLoaderStateAction() )
                throw new Error();
              }
              ctx.patchState({
                customer: {
                  datos: ctx.getState().customer.datos.map(user => user.code === id ? result.datos : user),
                  total: ctx.getState().customer.total
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


    @Action(CreateCustomer)
    create(ctx: StateContext<CustomerStateModel>, { payload }: CreateCustomer) {
      return this.customerService.createCustomer(payload).pipe(
        tap({
          next: result => {
            if (result.datos === null && result.result === null) {
              this.store.dispatch( new ResetLoaderStateAction() )
              throw new Error();
            }
            ctx.patchState({
              customer: {
                datos: [...ctx.getState().customer.datos, result.datos],
                total: ctx.getState().customer.total + 1
              }
            });
  
            this.notificationService.showSuccess(result.result.detail);
          },
          error: err => {
            this.store.dispatch( new ResetLoaderStateAction() )
            this.router.navigate(['/customers']);
            if(err?.error?.message){
              throw new Error(err?.error?.message);
            }
          }
        })
      )
    }
}