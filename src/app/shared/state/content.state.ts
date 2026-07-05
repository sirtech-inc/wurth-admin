import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { CreateUpdateContentMenu, EdithContentMenu, GetContentMenu, GetContentPageSelect, SetEcommerceMenu } from "@shared/action/content.action";
import { HideLoaderAction, ResetLoaderStateAction } from "@shared/action";
import { Injectable, NgZone } from "@angular/core";

import { ContentMenu } from "@shared/interface/content.interface";
import { ContentService } from "@shared/services/content.service";
import { NotificationService } from "@shared/services/index.service";
import { Router } from "@angular/router";
import { Select2Format } from "@shared/interface";
import { tap } from "rxjs";

export class ContentPageMenuStateModel {
    menu = {
        datos: [] as ContentMenu[],
        total: 0
    }
    selectedMenu: ContentMenu | null;
    selectedEcommerce: string

    selectPageSelect2: Select2Format[]
}

@State<ContentPageMenuStateModel>({
    name: "content",
    defaults: {
        menu: {
            datos: [],
            total: 0
        },
        selectedMenu: null,
        selectedEcommerce: null,
        selectPageSelect2: []
    }
})
@Injectable()
export class ContentState {

    constructor(
        private store: Store,
        private contentService: ContentService,
        private notificationService: NotificationService,
        private ngZone: NgZone,
        private router: Router,
    ) { }

    @Selector()
    static menu(state: ContentPageMenuStateModel) {
        return state.menu;
    }

    @Selector()
    static selectedMenu(state: ContentPageMenuStateModel) {
        return state.selectedMenu;
    }

    @Selector()
    static selectedEcommerce(state: ContentPageMenuStateModel) {
        return state.selectedEcommerce;
    }

    
    @Selector()
    static selectPageSelect2(state: ContentPageMenuStateModel) {
        return state.selectPageSelect2;
    }



    @Action(GetContentMenu)
    getContentMenu(ctx: StateContext<ContentPageMenuStateModel>, action: GetContentMenu) {
        return this.contentService.getMenus(action.ecommerce).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        ...ctx.getState(),
                        menu: {
                            datos: result?.datos?.datos ?? [],
                            total: result?.datos?.datos.length
                        }
                    })
                },
                error: err => {
                    throw new Error(err?.error?.message)
                }
            })
        )
    }

    @Action(SetEcommerceMenu)
    setEcommerceMenu(ctx: StateContext<ContentPageMenuStateModel>, action: SetEcommerceMenu) {
        ctx.patchState({
            ...ctx.getState(),
            selectedEcommerce: action.ecommerce
        })
    }

    @Action(CreateUpdateContentMenu)
    createUpdateContentMenu(ctx: StateContext<ContentPageMenuStateModel>, action: CreateUpdateContentMenu) {
        return this.contentService.menuSave(action.payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        menu: {
                            datos: [...ctx.getState().menu.datos, result.datos],
                            total: ctx.getState().menu.total + 1
                        }
                    })

                    this.notificationService.showSuccess(result.result.detail)
                    this.store.dispatch(new GetContentMenu(result?.datos?.ecommerce));

                    if (!action?.payload?.code) {
                        this.ngZone.run(() => {
                            this.router.navigate(['/menus/edit', result?.datos?.code]).then();
                        })
                    }


                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }

    @Action(EdithContentMenu)
    edithContentMenu(ctx: StateContext<ContentPageMenuStateModel>, action: EdithContentMenu) {
        return this.contentService.editMenu(action.payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.ngZone.run(() => {
                            this.router.navigate(['/menus']).then();
                        })
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        ...ctx.getState(),
                        selectedMenu: result.datos
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }

    @Action(GetContentPageSelect)
    getContentPageSelect(ctx: StateContext<ContentPageMenuStateModel>, action: GetContentPageSelect) {
        return this.contentService.getContentPageSelect(action.payload).pipe(
            tap({
                next: (result) => {

                    ctx.patchState({
                        ...ctx.getState(),
                        selectPageSelect2 : result?.datos?.datos.map((page) => {
                            return {
                                value: page?.code,
                                label: page?.title
                            }
                        })
                    })
                },
                error: (err) => {
                    throw new Error(err?.error?.message)
                }
            })
        )
    }




}