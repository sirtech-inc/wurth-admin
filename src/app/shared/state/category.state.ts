import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {
    EditCategory,
    GetCategories,
    GetCategoriesByEcommerce,
    ResetCategory,
    SaveCategory,
    SetEcommerce
} from "@shared/action";
import {HideLoaderAction, ResetLoaderStateAction} from "@shared/action";

import {Category,} from "@shared/interface";
import {CategoryService} from "../services/category.service";
import {Injectable, NgZone} from "@angular/core";
import {NotificationService} from "../services/notification.service";
import {Router} from "@angular/router";
import {of, tap} from "rxjs";

export class CategoryStateModel {
    category = {
        datos: [] as Category[],
        total: 0
    }
    selectedCategory: Category | null
    selectedEcommerce: string | null
}

@State<CategoryStateModel>({
    name: "category",
    defaults: {
        category: {
            datos: [],
            total: 0
        },
        selectedCategory: null,
        selectedEcommerce: null
    },
})
@Injectable()
export class CategoryState {


    constructor(
        private store: Store,
        private notificationService: NotificationService,
        private categoryService: CategoryService,
        private router: Router,
        private ngZone: NgZone
    ) {
    }


    @Selector()
    static category(state: CategoryStateModel) {
        return state.category;
    }


    // @Selector()
    // static categories(state: CategoryStateModel) {
    //   return state.category.data.map(res => {
    //     return { label: res?.name, value: res?.id, data: {
    //       name: res.name,
    //       slug: res.slug,
    //       image: res.category_icon ? res.category_icon.original_url : 'assets/images/category.png'
    //     }}
    //   });
    // }


    @Action(GetCategories)
    getCategories(ctx: StateContext<CategoryStateModel>, action: GetCategories) {
        return this.categoryService.getCategories().pipe(
            tap({
                next: result => {
                    ctx.patchState({
                        ...ctx.getState(),
                        category: {
                            datos: result.datos.datos ?? [],
                            total: result.datos.datos.length
                        }
                    });
                },
                error: err => {
                    throw new Error(err?.error?.message);
                }
            })
        );
    }

    @Action(GetCategoriesByEcommerce)
    getCategoriesByEcommerce(ctx: StateContext<CategoryStateModel>, action: GetCategoriesByEcommerce) {
        return this.categoryService.getCategoriesByEcommerce(action.ecommerce).pipe(
            tap({
                next: result => {
                    ctx.patchState({
                        ...ctx.getState(),
                        category: {
                            datos: result.datos?.datos ?? [],
                            total: result.datos?.datos?.length
                        }
                    });
                },
                error: err => {
                    throw new Error(err?.error?.message);
                }
            })
        );
    }




    @Selector()
    static selectedCategory(state: CategoryStateModel) {
        return state?.selectedCategory ?? null;
    }


    @Action(EditCategory)
    edit(ctx: StateContext<CategoryStateModel>, {id}: EditCategory) {
        if(!id){
            return of(null)
        }
        return this.categoryService.getCategoryById(id).pipe(
            tap({
                next: result => {
                    if (result.datos === null) {

                        this.ngZone.run(() => {
                            this.router.navigate(['/category']).then();
                        })

                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        ...ctx.getState(),
                        selectedCategory: result.datos
                    });

                },
                error: err => {
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }

                }
            })
        )
    }


    @Action(SaveCategory)
    saveCategory(ctx: StateContext<CategoryStateModel>, {payload}: SaveCategory) {
        return this.categoryService.saveCategory(payload).pipe(
            tap({
                next: result => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    const state = ctx.getState();
                    ctx.patchState({
                        ...state,
                        selectedCategory: result?.datos
                    });

                    this.notificationService.showSuccess(result?.result?.detail);
                    this.store.dispatch(new GetCategories());

                },
                error: err => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }


    /*
    @Action(UpdateCategory)
    update(ctx: StateContext<CategoryStateModel>, { payload, id }: UpdateCategory) {
      return this.categoryService.updateCategory(id, payload).pipe(
        tap({
          next: response => {

            if (response.datos === null && response.result === null) {
              this.store.dispatch(new ResetLoaderStateAction())
              throw new Error();
            }

            const state = ctx.getState();
            ctx.patchState({
              ...state,
              selectedCategory: response?.datos
            });
            this.notificationService.showSuccess(response?.result?.detail);
            this.store.dispatch(new GetCategories());
            this.store.dispatch(new HideButtonSpinnerAction())

          },
          error: err => {

            this.store.dispatch(new ResetLoaderStateAction())
            this.store.dispatch(new HideLoaderAction())

            if (err?.error?.message) {
              throw new Error(err?.error?.message);
            }
          }
        })
      )
    }

    @Action(CreateCategory)
    create(ctx: StateContext<CategoryStateModel>, { payload }: CreateCategory) {
      return this.categoryService.createCategory(payload).pipe(
        tap({
          next: result => {

            if (result.datos === null && result.result === null) {
              this.store.dispatch(new ResetLoaderStateAction())
              throw new Error();
            }

            const state = ctx.getState();
            ctx.patchState({
              ...state,
              selectedCategory: result?.datos
            });

            this.notificationService.showSuccess(result?.result?.detail);
            this.store.dispatch(new GetCategories());

          },
          error: err => {
            this.store.dispatch(new ResetLoaderStateAction())
            this.store.dispatch(new HideLoaderAction())
            if (err?.error?.message) {
              throw new Error(err?.error?.message);
            }
          }
        })
      )
    }
   */

    @Action(ResetCategory)
    reset(ctx: StateContext<CategoryStateModel>) {
        ctx.patchState({
            ...ctx.getState(),
            selectedCategory: null
        })
    }

    @Action(ResetLoaderStateAction)
    resetLoader(ctx: StateContext<CategoryStateModel>) {
        ctx.patchState({
            ...ctx.getState(),
            selectedCategory: null
        })
    }


    @Action(SetEcommerce)
    setEcommerce(ctx: StateContext<CategoryStateModel>, {ecommerce}: SetEcommerce) {
        ctx.patchState({
            ...ctx.getState(),
            selectedEcommerce: ecommerce
        })
    }

    @Selector()
    static selectedEcommerce(state: CategoryStateModel) {
        return state?.selectedEcommerce ?? null;
    }
}
