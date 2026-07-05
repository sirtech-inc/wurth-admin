import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {
    EditProduct,
    GetProducts,
    GetProductsToSelect,
    SaveProduct
} from "../action/product.action";
import {HideLoaderAction, ResetLoaderStateAction} from "@shared/action";
import {Product, ProductToSelect} from "@shared/interface";

import {Injectable} from "@angular/core";
import {NotificationService} from "../services/notification.service";
import {ProductService} from "../services/product.service";
import {Router} from "@angular/router";
import {Select2DataFormat} from "@shared/interface";
import {of, tap} from "rxjs";
import {OptionalAll} from "@shared/types/util.types";

export class ProductStateModel {
    product = {
        datos: [] as Product[],
        total: 0
    }
    productSelect = {
        datos: [] as ProductToSelect[],
    }
    selectedProduct: Product | null
    topSellingProducts: Product[]
}

@State<ProductStateModel>({
    name: "product",
    defaults: {
        product: {
            datos: [],
            total: 0
        },
        productSelect: {
            datos: []
        },
        selectedProduct: null,
        topSellingProducts: []
    },
})
@Injectable()
export class ProductState {

    constructor(
        private productService: ProductService,
        private store: Store,
        private router: Router,
        private notificationService: NotificationService
    ) {
    }

    @Selector()
    static product(state: ProductStateModel) {
        return state.product;
    }

    @Selector()
    static selectedProduct(state: ProductStateModel) {
        return state.selectedProduct;
    }

    @Selector()
    static productsSelect(state: ProductStateModel) {
        return state.productSelect.datos
    }


    @Selector()
    static selectProductToSelect(state: ProductStateModel): Select2DataFormat<{}>[] {
        return state.productSelect.datos
            .map((product: Product) => ({
                value: product.code,
                label: product.name,
                other: {
                    name: product.name,
                    reference: product.reference,
                },
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    @Selector()
    static  selectProductToSelect2ByEcommerce(state: ProductStateModel){
        return (ecommerce:string): Select2DataFormat<{}>[]  => {
            return state.productSelect.datos
                .filter((product: Product) => product.ecommerce === ecommerce)
                .map((product: Product) => ({
                    value: product.code,
                    label: product.name,
                    other: {
                        name: product.name,
                        reference: product.reference,
                    },
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
        }
    }


    @Action(GetProducts)
    getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
        return this.productService.getProducts(action.payload).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        product: {
                            datos: result.datos.datos,
                            total: result.datos.count
                        },
                    });
                },
                error: (err) => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        );
    }

    @Action(GetProductsToSelect)
    getProductsToSelect(ctx: StateContext<ProductStateModel>, { payload }: GetProductsToSelect) {
        return this.productService.getProductsToSelect(payload).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        productSelect: {
                            datos: result.datos.datos.map((product) => {
                                return {
                                    code: product.code,
                                    name: product.name,
                                    reference: product.reference,
                                    selected: false,
                                    status: product.status,
                                }
                            })
                        },
                    });
                },
                error: (err) => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        );
    }




    @Action(EditProduct)
    edit(ctx: StateContext<ProductStateModel>, {payload}: EditProduct) {
        if (!payload) {
            ctx.patchState({
                ...ctx.getState(),
                selectedProduct: null
            });
            return of(null);
        }
        return this.productService.getProductById(payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction());
                        throw new Error();
                    }
                    const products = ctx.getState().product.datos;
                    const index = products.findIndex((prod) => prod.code === result.datos.code);
                    products[index] = result.datos;

                    ctx.patchState({
                        ...ctx.getState(),
                        selectedProduct: result.datos,
                    });

                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction());
                    this.router.navigate(["/products"]);
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        );
    }


    @Action(SaveProduct)
    saveProduct(ctx: StateContext<ProductStateModel> , action: SaveProduct) {
        return this.productService.saveProduct(action.payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        product: {
                            datos: [...ctx.getState().product.datos, result.datos],
                            total: ctx.getState().product.total + 1
                        },
                        selectedProduct: result.datos
                    });

                    this.notificationService.showSuccess(result.result.detail);

                },
                error: (err) => {

                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }

                },
            })
        );
    }


    /*
    @Action(CreateProduct)
    createProduct(ctx: StateContext<ProductStateModel>, action: CreateProduct) {
        return this.productService.createProduct(action.payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        product: {
                            datos: [...ctx.getState().product.datos, result.datos],
                            total: ctx.getState().product.total + 1
                        },
                        selectedProduct: result.datos
                    });

                    this.notificationService.showSuccess(result.result.detail);

                },
                error: (err) => {

                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }

                },
            })
        );
    }
    */

    @Action(ResetLoaderStateAction)
    resetLoader(ctx: StateContext<ProductStateModel>) {
        ctx.patchState({
            ...ctx.getState(),
            selectedProduct: null
        })
    }

    /*
    @Action(UpdateProduct)
    updateProduct(ctx: StateContext<ProductStateModel>, action: UpdateProduct) {
        return this.productService.updateProduct(action.payload, action.id).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    const products = ctx.getState().product.datos;
                    const index = products.findIndex((prod) => prod.code === result.datos.code);
                    products[index] = result.datos;

                    ctx.patchState({
                        ...ctx.getState(),
                        selectedProduct: result.datos
                    });

                    this.notificationService.showSuccess(result.result.detail);

                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        );
    }
    */

}
