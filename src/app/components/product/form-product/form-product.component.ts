import { ActivatedRoute, Router } from "@angular/router";
import {
  AdvanceDropDownFormat,
  Attachment,
  Category,
  CategoryModel,
  Product,
  ProductToSelect,
  Select2DataFormat,
  Upload,
} from "@shared/interface";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  CategoryState,
  ProductState,
  TagState,
} from "@shared/state/index.state";
import {
  EditProduct,
  GetCategories,
  GetProductsToSelect,
  GetTagsToSelect,
  ResetProduct,
  SaveProduct,
} from "@shared/action";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";
import {
  Observable,
  Subject,
  forkJoin,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  pipe,
  of,
} from "rxjs";
import { Select, Store } from "@ngxs/store";

import { Editor, toHTML, Toolbar } from "ngx-editor";
import { FormValidator } from "@shared/validator/form-validator";
import { GetParameters } from "@shared/action/parameter.action";
import { NotificationService } from "@shared/services/index.service";
import { ParameterService } from "@shared/services/parameter.service";
import { ParameterState } from "@shared/state/parameter.state";
import { ProductForm } from "src/app/shared/interface/product.interface";
import { OptionalAll, TypeForm } from "src/app/shared/types/util.types";
import { UploadFileAttachment, UploadFileImage } from "@shared/action/file-image.action";
import { Select2Data } from "ng-select2-component";
import { fadeAnimation } from "@shared/animations";
import { CategoryModule } from "@components/category/category.module";

@Component({
  selector: "app-form-product",
  templateUrl: "./form-product.component.html",
  styleUrls: ["./form-product.component.scss"],
  animations: [fadeAnimation],
})
export class FormProductComponent implements OnInit, OnDestroy {
  @Input() type: TypeForm;
  @ViewChild("nav") nav: NgbNav;

  //@Select(CategoryState.category) category$: Observable<CategoryModel>;
  @Select(ParameterState.parametersSelect2("ecommerce")) ecommerce$: Observable<
    Select2DataFormat<string>[]
  >;
  @Select(TagState.selectAdvancedDropDown) tags$: Observable<
    AdvanceDropDownFormat<null>[]
  >;
  @Select(ProductState.productsSelect) products$: Observable<ProductToSelect[]>;

  private destroy$ = new Subject<void>();

  public categories: CategoryModel;
  public categoriesFilter: CategoryModel;

  public active = "general";
  public tabError: string | null;
  public category: Category;
  public editor_short: Editor;
  public editor: Editor;

  public toolbar_short: Toolbar = [["bold", "italic", "underline"]];

  public form: FormGroup<ProductForm>;

  private fileImage: File = null;
  private fileSeo: File = null;
  private fileAttachment: File = null;
  public id: number;
  public html = "";

  public selectedTags: number[] = [];
  public selectedCategories: number[] = [];
  public selectedRelated: ProductToSelect[] = [];
  public selectedCrossSell: ProductToSelect[] = [];

  constructor(
    private store: Store,
    private parameterService: ParameterService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.initServices();
  }

  /*
    onSelectedEcommerce(event, onSelect: boolean) {
        if (onSelect) {
            const ecommerce = event?.options.at(0).other?.value
            this.categoriesFilter = {
                datos: this.categories.datos.filter((item) => item.ecommerce === ecommerce).map((item) => {
                    return {
                        ...item,
                    }
                })
            }
            this.selectedCategories = null
            this.form.controls['category'].setValue(null);
        }
    }
    */

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getField(field: string) {
    return this.form.get(field).value; //controls[field].value
  }

  private getSelectedEcommerceKeys(
    ecommerceValue: number | string | Array<number | string> | null
  ): string[] {
    if (ecommerceValue === null || ecommerceValue === undefined) return [];

    const ids = (Array.isArray(ecommerceValue) ? ecommerceValue : [ecommerceValue])
      .map((item) => Number(item))
      .filter((item) => !Number.isNaN(item));

    if (!ids.length) return [];

    return this.parameterService.getOtherByValue(ids, "ecommerce") || [];
  }

  initServices() {
    const ecommerce$ = this.store.dispatch(
      new GetParameters({ key: "ecommerce" })
    );
    const categories$ = this.store.dispatch(new GetCategories());
    const tags$ = this.store.dispatch(new GetTagsToSelect());
    const products$ = this.store.dispatch(new GetProductsToSelect('b2b'));

    this.route.params
      .pipe(
        switchMap((params) => {
          return this.store
            .dispatch(new EditProduct(params["id"]))
            .pipe(
              mergeMap(() => this.store.select(ProductState.selectedProduct))
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((product) => {
        forkJoin([ecommerce$, categories$, tags$, products$]).subscribe({
          complete: () => {
            this.categories = this.store.selectSnapshot(CategoryState.category);

            if (product?.code) {
              this.id = product.code;
              const ecommerceKeys = product?.ecommerce
                ? product.ecommerce
                    .toString()
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => !!item)
                : [];
              const ecommerce = this.parameterService.getValueByOther(
                ecommerceKeys,
                "ecommerce"
              );

              this.categoriesFilter = {
                datos: this.categories.datos
                  .filter((item) => ecommerceKeys.includes(item.ecommerce))
                  .map((item) => {
                    return {
                      ...item,
                    };
                  }),
              };

              this.form.patchValue({
                ...product,
                ecommerce: ecommerce,
                image_meta_id: (product?.image_meta as Attachment)?.code,
              });

              this.selectedTags = product?.tag;
              this.selectedCategories = product?.category;

              if (
                product?.cross_sell_products_id &&
                product?.cross_sell_products_id.length > 0
              ) {
                const products = this.store.selectSnapshot(
                  ProductState.productsSelect
                );
                this.selectedCrossSell = products.filter((item) =>
                  product?.cross_sell_products_id.includes(item.code)
                );
              }

              if (
                product?.related_products_id &&
                product?.related_products_id.length > 0
              ) {
                const products = this.store.selectSnapshot(
                  ProductState.productsSelect
                );
                this.selectedRelated = products.filter((item) =>
                  product?.related_products_id.includes(item.code)
                );
              }
            } else {
              setTimeout(() => {
                this.form
                  .get("ecommerce")
                  .valueChanges.pipe(takeUntil(this.destroy$))
                  .subscribe((event) => {
                    this.selectedCategories = null;
                    this.form.controls["category"].setValue(null);

                    const ecommerceKeys = this.getSelectedEcommerceKeys(
                      event as number | string | Array<number | string> | null
                    );
                    if (ecommerceKeys.length) {
                      this.categoriesFilter = {
                        datos: this.categories.datos
                          .filter((item) =>
                            ecommerceKeys.includes(item.ecommerce)
                          )
                          .map((item) => {
                            return {
                              ...item,
                            };
                          }),
                      };
                    }
                  });
              }, 1000);
            }
          },
        });
      });
  }

  prepareImages(): Attachment[] {
    let images: Attachment[];
    images = this.form.controls["images"].value as Attachment[];
    if (Array.isArray(images) && images.length > 0) {
      return images;
    }
    return null;
  }

  prepareMeta(): Attachment {
    const meta = this.form.controls["image_meta"].value;
    if (meta) {
      return meta as Attachment;
    }
    return null;
  }

  prepareAttachments(): Attachment[] {
    let attachments: Attachment[];
    attachments = this.form.controls["attachment"].value as Attachment[];
    if (Array.isArray(attachments) && attachments.length > 0) {
      return attachments;
    }
    return null;
  }

  private initForm() {
    this.form = this.formBuilder.group<ProductForm>({
      code: new FormControl(null),
      ecommerce: new FormControl(null, [Validators.required]),
      name: new FormControl("", [Validators.required]),
      reference: new FormControl("", [Validators.required]),
      short_description: new FormControl(null),
      description: new FormControl(null),
      tag: new FormControl(null),
      category: new FormControl(null, [Validators.required]),
      package: new FormControl(null, [
        Validators.required,
        FormValidator.PackingValidator,
      ]),
      related_random: new FormControl(null),
      related_products: new FormControl(null),
      related_products_id: new FormControl(null),
      cross_sell_products: new FormControl(null),
      cross_sell_products_id: new FormControl(null),
      url_youtube: new FormControl(null),
      images: new FormControl(null),
      images_id: new FormControl(null),
      seo_title: new FormControl(null),
      seo_description: new FormControl(null),
      image_meta: new FormControl(null),
      image_meta_id: new FormControl(null),
      status_featured: new FormControl(null),
      status_trending: new FormControl(null),
      status_offer: new FormControl(null),
      status: new FormControl(null),
      attachment: new FormControl(null),
      attachment_id: new FormControl(null),
    });

    this.editor_short = new Editor();
    this.editor = new Editor();
  }

  /*
    onSelectEcommerceItem(data: number[]) {
        const selected = this.parameterService.getOtherByValue(data, 'ecommerce') //.getOtherById(data)
        if (selected && Array.isArray(selected)) {
          this.form.controls['ecommerce'].setValue(selected);
        }else{
          this.form.controls['ecommerce'].setValue(null);
        }
    }
    */

  onSelectCategoryItem(data: number[]) {
    if (Array.isArray(data) && data.length) {
      this.form.controls["category"].setValue(data);
    } else {
      this.form.controls["category"].setValue(null);
    }
  }

  onSelectedTagItem(data: Number[]) {
    if (Array.isArray(data)) {
      this.form.controls["tag"].setValue(
        Array.isArray(data) ? (data as number[]) : []
      );
    }
  }

  onSelectFile(event, type: "seo" | "image" | "attachment") {
    if (type === "image") this.fileImage = event;
    if (type === "seo") this.fileSeo = event;
    if (type === "attachment") this.fileAttachment = event;
  }

  onFilesRegistered(event: Attachment[], type: "seo" | "image" | "attachment") {
    // `event` es la lista completa y actual (showFiles), que puede incluir
    // archivos recién seleccionados que todavía no se subieron y por lo tanto
    // no tienen `code` real. Esos se excluyen aquí: se agregan por separado al
    // guardar (ver onSave), una vez que la subida real devuelve su code.
    const existingCodes = (event ?? [])
      .map((item: Attachment) => item.code)
      .filter((code) => code !== null && code !== undefined);

    if (type === "image") {
      this.form.controls["images_id"].setValue(existingCodes.length > 0 ? existingCodes : null);
    }

    if (type === "seo") {
      this.form.controls["image_meta_id"].setValue(existingCodes.length > 0 ? existingCodes[0] : null);
    }

    if (type === "attachment") {
      this.form.controls["attachment_id"].setValue(existingCodes.length > 0 ? existingCodes : null);
    }

  }

  onSelectedRelated(element: ProductToSelect, type: "related" | "cross_sell") {
    if (type === "related") {
      if (!this.selectedRelated.find((item) => item.code === element.code)) {
        this.selectedRelated = [...this.selectedRelated, element];
      }
    }
    if (type === "cross_sell") {
      if (!this.selectedCrossSell.find((item) => item.code === element.code)) {
        this.selectedCrossSell = [...this.selectedCrossSell, element];
      }
    }
  }

  onRemoveRelated(element: ProductToSelect, type: "related" | "cross_sell") {
    if (type === "related") {
      this.selectedRelated = this.selectedRelated.filter(
        (item) => item.code !== element.code
      );
    }
    if (type === "cross_sell") {
      this.selectedCrossSell = this.selectedCrossSell.filter(
        (item) => item.code !== element.code
      );
    }
  }

  onSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.notificationService.showError("Complete los campos requeridos", "Aviso");
      return;
    }

    const fileImage$ = this.fileImage ? this.store
      .dispatch(new UploadFileImage(this.fileImage, "formData",
        {
          vDescripcion: this.form.controls["name"].value,
          vModule: "product",
        },
        true)
      ).pipe(map((response) => response.file.selectedFile as Upload[])) : of([]);

    const fileMeta$ = this.store.dispatch(new UploadFileImage(this.fileSeo, "queryString", {
      vDescripcion: this.form.controls["name"].value,
      vModule: "other",
    })
    )
      .pipe(map((response) => response.file.selectedFile as Upload));

    const fileAttachment$ = this.fileAttachment ? this.store
      .dispatch(new UploadFileAttachment(this.fileAttachment, "formData",
        {
          vDescripcion: this.form.controls["name"].value,
          vModule: "product_attachment",
        },
        true)
      )
      .pipe(map((response) => response.file.selectedFile as Upload[])) : of([]);



    forkJoin([fileImage$, fileMeta$, fileAttachment$]).subscribe({
      next: ([fileImage, fileMeta, fileAttachment]) => {
        try {
          const _package = (this.form.controls["package"]?.value ?? '')
            .toString()
            .split(',')
            .filter(x => x !== '')
            .map((item: string) => parseInt(item, 10));

          const newAttachments = fileAttachment?.length
            ? fileAttachment.map((x: any) => Number(x.code))
            : [];

          const existingAttachments = this.form.controls["attachment_id"]?.value ?? [];
          const attachment_ids = [...existingAttachments, ...newAttachments].filter((id) => id !== null && id !== undefined);

          // 🔹 Manejo seguro de imágenes
          const existingImages = this.form.controls['images_id']?.value ?? [];
          const newImages = fileImage?.length > 0
            ? fileImage.map((resp: any) => Number(resp.code))
            : [];
          let images_id = [...newImages, ...existingImages].filter((id) => id !== null && id !== undefined);
          images_id = images_id.length > 0 ? images_id : null;

          // 🔹 Manejo seguro de metadatos
          let image_meta_id = fileMeta ? Number(fileMeta.code) : null;
          image_meta_id = image_meta_id
            ? image_meta_id
            : (this.form.controls["image_meta_id"]?.value ?? null);

          // 🔹 Manejo seguro ecommerce
          const ecommerceArray = this.getSelectedEcommerceKeys(
            this.getField("ecommerce") as
              | number
              | string
              | Array<number | string>
              | null
          );
          const ecommerce =
            ecommerceArray.length > 0 ? ecommerceArray.join(",") : null;

          // 🔹 Manejo seguro arrays seleccionados
          const related_products_id = (this.selectedRelated || []).map(item => item.code);
          const cross_sell_products_id = (this.selectedCrossSell || []).map(item => item.code);

          // 🔹 Manejo seguro attachments
          /*const attachmentsForm = this.form.controls['attachment']?.value ?? [];
          const attachment_ids = attachmentsForm.length > 0
            ? attachmentsForm.map((att: any) => Number(att.code))
            : null;*/

          //const attachment_ids = this.form.controls['attachment_id']?.value ?? null;


          // 🔹 Construir objeto
          const data: OptionalAll<Product> = {
            ...this.form.getRawValue(),
            short_description: this.editor_short?.view?.dom?.innerHTML ?? '',
            description: this.editor?.view?.dom?.innerHTML ?? '',
            code: this.form.value.code ?? 0,
            ecommerce,
            images: images_id,
            image_meta: image_meta_id,
            package: _package,
            attachment: attachment_ids,
            related_random:
              this.form.value.related_random === true ||
                this.form.value.related_random === 1
                ? "active"
                : "inactive",
            related_products:
              related_products_id.length > 0 ? related_products_id : null,
            cross_sell_products:
              cross_sell_products_id.length > 0 ? cross_sell_products_id : null,
            status:
              this.form.value.status === true || this.form.value.status === 1
                ? "active"
                : "inactive",
            status_featured:
              this.form.value.status_featured === true ||
                this.form.value.status_featured === 1
                ? "active"
                : "inactive",
            status_trending:
              this.form.value.status_trending === true ||
                this.form.value.status_trending === 1
                ? "active"
                : "inactive",
            status_offer:
              this.form.value.status_offer === true ||
                this.form.value.status_offer === 1
                ? "active"
                : "inactive",
            tag:
              this.form.value.tag && this.form.value.tag.length > 0
                ? this.form.value.tag
                : null,
          };

          // 🔹 Dispatch final
          const action = new SaveProduct(data);
          this.store
            .dispatch(action)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                const selected = this.store.selectSnapshot(
                  ProductState.selectedProduct
                );
                if (selected.code && this.type === "create") {
                  this.router.navigate(["/products", "edit", selected.code]);
                } else if (selected.code && this.type === "edit") {
                  this.store.dispatch(new ResetProduct());
                  this.router.navigate(["/products"]);
                }
              },
            });
        } catch (err) {
          console.error('ERROR DENTRO DEL NEXT >>>', err);
        }
      },
      error: (err) => console.error("ERROR EN DISPATCH >>>", err)
    });

  }
}
