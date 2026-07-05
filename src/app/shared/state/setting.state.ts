import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {NotificationService} from "../services/notification.service";
import {SettingService} from "../services/setting.service";
import {
    SocialNetworks,
    SocialNetworksPost,
    Values,
    CategoryModel,
    Select2DataFormat,
    SimpleFormat,
    ValuesResponse,
    SettingLinks, SettingContents, SettingPolicies
} from '@shared/interface';
import {
    ClearSetting,
    ClearSocialNetworks,
    CreateUpdateSettingOption,
    CreateUpdateSocialNetworks,
    GetCategoriesForSetting, GetSettingContents, GetSettingLinks,
    GetSettingOptionByEcommerce, GetSettingPolicies,
    GetSocialNetworks,
    HideLoaderAction,
    ResetLoaderStateAction
} from "@shared/action";
import {concatMap, from, tap, toArray} from "rxjs";
import {CategoryService} from "@shared/services/index.service";
import {OptionalAll} from "@shared/types/util.types";

export class SettingStateModel {
    setting: Values | null
    settingLinks: SettingLinks[] | null
    settingResponse: ValuesResponse | null
    settingPolicies: SettingPolicies[]  | null
    settingContents: SettingContents[] | null
    socialNetworks: SocialNetworks[] | null
    categories: CategoryModel
}

@State<SettingStateModel>({
    name: "setting",
    defaults: {
        setting: null,
        settingLinks: null,
        settingResponse: null,
        settingContents: null,
        settingPolicies: null,
        socialNetworks: null,
        categories: null
    }
})
@Injectable()
export class SettingState {

    constructor(
        private settingService: SettingService,
        private notificationService: NotificationService,
        private categoryService: CategoryService,
        private store: Store
    ) {
    }

    @Selector()
    static setting(state: SettingStateModel) {
        return state.setting;
    }

    @Selector()
    static settingResponse(state: SettingStateModel) {
        return state.settingResponse;
    }

    @Selector()
    static socialNetworks(state: SettingStateModel) {
        return state.socialNetworks
    }

    @Selector()
    static socialNetworksSelect2(state: SettingStateModel): OptionalAll<Select2DataFormat<SimpleFormat>>[] {
        if (state.socialNetworks) {
            return state.socialNetworks.map((socialNetwork: SocialNetworks) => {
                return {
                    label: socialNetwork.name,
                    value: socialNetwork.code_social_network
                }
            })
        }
        return null
    }

    @Selector()
    static categories(state: SettingStateModel) {
        return state.categories
    }

    @Selector()
    static settingLinksSelect2(state: SettingStateModel): OptionalAll<Select2DataFormat<SimpleFormat>>[] {
        if (state.settingLinks) {
            return state.settingLinks.map((settingLink: SettingLinks) => {
                return {
                    label: settingLink.label,
                    value: settingLink.code
                }
            })
        }
        return null
    }

    @Selector()
    static settingContentsSelect2(state: SettingStateModel): OptionalAll<Select2DataFormat<SimpleFormat>>[] {
        if (state.settingContents) {
            return state.settingContents.map((settingContent: SettingContents) => {
                return {
                    label: settingContent.title,
                    value: settingContent.code
                }
            })
        }
        return null
    }

    @Selector()
    static settingPoliciesSelect2(state: SettingStateModel): OptionalAll<Select2DataFormat<SimpleFormat>>[] {
        if (state.settingPolicies) {
            return state.settingPolicies.map((settingPolicy: SettingPolicies) => {
                return {
                    label: settingPolicy.title,
                    value: settingPolicy.code
                }
            })
        }
        return null
    }

    @Action(CreateUpdateSettingOption)
    createUpdateSettingOption(ctx: StateContext<SettingStateModel>, action: CreateUpdateSettingOption) {
        return this.settingService.createUpdateSetting(action.payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    const socialNetworks = action.payload.social_networks
                    this.store.dispatch(new CreateUpdateSocialNetworks({
                        ecommerce_plain: action.payload.ecommerce,
                        ecommerce: result.datos.code,
                        socialNetworks: socialNetworks
                    }))

                    // this.notificationService.showSuccess(result.result.detail)
                    // this.store.dispatch(new GetSettingOptionByEcommerce(action.payload.ecommerce))
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        )

    }

    @Action(CreateUpdateSocialNetworks)
    createUpdateSocialNetworks(ctx: StateContext<SettingStateModel>, payload: CreateUpdateSocialNetworks) {
        const data: SocialNetworksPost[] = payload.payload.socialNetworks.map((socialNetwork: SocialNetworks) => {
            return {
                fk_configuration: payload.payload.ecommerce,
                fk_social_network: socialNetwork.code_social_network,
                url: socialNetwork.url,
                status: socialNetwork.status === true || socialNetwork.status === 1 ? 'active' : 'inactive'
            }
        })

        from(data).pipe(
            concatMap((socialNetwork: SocialNetworksPost) => this.settingService.createUpdateSocialNetworks(socialNetwork)),
            toArray()
        )
            .subscribe({
                next: (result) => {
                    this.notificationService.showSuccess('Se han guardado los cambios')
                    this.store.dispatch(new GetSettingOptionByEcommerce(payload.payload.ecommerce_plain))
                    this.store.dispatch(new GetSocialNetworks(payload.payload.ecommerce_plain))
                },
                complete: () => {
                    console.log('complete!')
                }
            })
    }

    @Action(ClearSetting)
    clearSetting(ctx: StateContext<SettingStateModel>) {
        ctx.setState({
            ...ctx.getState(),
            settingResponse: null
        });
    }

    @Action(GetSettingOptionByEcommerce)
    getSettingOptionByEcommerce(ctx: StateContext<SettingStateModel>, action: GetSettingOptionByEcommerce) {
        return this.settingService.getSettingByEcommerce(action.ecommerce).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        ...ctx.getState(),
                        settingResponse: result.datos
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        )
    }

    @Action(ClearSocialNetworks)
    clearSocialNetworks(ctx: StateContext<SettingStateModel>) {
        ctx.setState({
            ...ctx.getState(),
            socialNetworks: null
        });
    }

    @Action(GetSocialNetworks)
    getSocialNetworks(ctx: StateContext<SettingStateModel>, action: GetSocialNetworks) {
        return this.settingService.getSocialNetworks(action.payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    this.store.dispatch(new ClearSocialNetworks)

                    ctx.patchState({
                        ...ctx.getState(),
                        socialNetworks: result.datos
                    })

                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        )
    }

    @Action(GetCategoriesForSetting)
    getCategoriesForSetting(ctx: StateContext<SettingStateModel>, action: GetCategoriesForSetting) {
        return this.categoryService.getCategoriesByEcommerce(action.ecommerce).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        ...ctx.getState(),
                        categories: result.datos
                    })

                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        )
    }

    @Action(GetSettingLinks)
    getSettingLinks(ctx: StateContext<SettingStateModel>, action: GetSettingLinks) {
        return this.settingService.getSettingLinks().pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        ...ctx.getState(),
                        settingLinks: result.datos
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        )
    }

    @Action(GetSettingContents)
    getSettingContents(ctx: StateContext<SettingStateModel>, action: GetSettingContents) {
        return this.settingService.getSettingContents(action.ecommerce).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        ...ctx.getState(),
                        settingContents: result.datos
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        )
    }

    @Action(GetSettingPolicies)
    getSettingPolicies(ctx: StateContext<SettingStateModel>) {
        return this.settingService.getSettingPolicies().pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        ...ctx.getState(),
                        settingPolicies: result.datos
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        )
    }



}
