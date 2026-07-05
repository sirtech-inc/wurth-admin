import { ActivatedRoute, Router } from '@angular/router';
import { AdvanceDropDownFormat, Attachment, ProductToSelect, TableClickedAction, TableConfig, Upload } from '@shared/interface';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CreatePack, EditPack, UpdatePack } from '@shared/action/pack.action';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, forkJoin, map, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { Pack, PackForm, PackProducForm, PackProduct } from '@shared/interface/pack.interface';
import { Select, Store } from '@ngxs/store';
import { Select2, Select2Data, Select2SearchEvent, Select2UpdateValue } from 'ng-select2-component';

import { FormService } from '@shared/validator/form.service';
import { FormValidator } from '@shared/validator/form-validator';
import { GetParameters } from '@shared/action/parameter.action';
import { GetProductsToSelect } from '@shared/action';
import { NotificationService } from '@shared/services/index.service';
import { PackState } from '@shared/state/pack.state';
import { ParameterService } from '@shared/services/parameter.service';
import { ParameterState } from '@shared/state/parameter.state';
import { ProductState } from '@shared/state/index.state';
import { UploadFileImage } from '@shared/action/file-image.action';

interface ItemPrepareItem {
  product: ProductToSelect
  discount: number
  quantity: number
}

@Component({
  selector: 'app-form-packs',
  templateUrl: './form-packs.component.html',
  styles: ``
})
export class FormPacksComponent implements OnInit, OnDestroy {

  @Select(ParameterState.parametersAdvanceDropDown('ecommerce')) ecommerce$: Observable<AdvanceDropDownFormat<string>[]>
  @Input() type: string;

  product: Select2Data = []
  productsFiltered: Select2Data = []

  public form: FormGroup<PackForm>
  private destroy$ = new Subject<void>();
  public selectedEcommerce: number[] = [];
  public id: number;
  public tableSelectProduct: ProductToSelect
  public tableQuantity = new FormControl(null)
  private fileImage: File = null;
  private tableDelete: PackProduct[] = []
  public ecommerceOptions: AdvanceDropDownFormat<string>[] = [];


  public tableConfig: TableConfig = {
    columns: [
      { title: "packs_form_table_item", dataField: "item", colSmall: true },
      { title: "packs_form_table_product", dataField: "reference", alignment: 'left' },
      { title: "packs_form_table_product_name", dataField: "name", sortable: true, alignment: 'left' },
      { title: "packs_form_table_quantity", dataField: "quantity", alignment: 'left' }
    ],
    rowActions: [
      { label: "global_delete", actionToPerform: "delete", icon: "ri-delete-bin-line" }
    ],
    data: [] as any[],
    total: 0
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private parameterService: ParameterService,
    private notificationService: NotificationService,
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.initServices();

    this.ecommerce$.pipe(takeUntil(this.destroy$)).subscribe(options => {
      this.ecommerceOptions = Array.isArray(options) ? options : [];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectEcommerceItem(data: number[]) {
    this.selectedEcommerce = Array.isArray(data) ? [...data] : [];

    const selectedOther = this.parameterService.getOtherByValue(this.selectedEcommerce, 'ecommerce');
    this.form.get('ecommerce')?.setValue(selectedOther, { emitEvent: false });

    if (!selectedOther || selectedOther.length === 0) {
      this.product = [];
      this.productsFiltered = [];
      return;
    }

    this.store.dispatch(new GetProductsToSelect(selectedOther[0]))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.product = this.store.selectSnapshot(ProductState.selectProductToSelect);
          this.productsFiltered = this.product;
        }
      });
  }




  private initServices() {

    this.store.dispatch(new GetParameters({ key: 'ecommerce' }))

    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) return of();
        return this.store.dispatch(new EditPack(params['id']))
          .pipe(mergeMap(() => this.store.select(PackState.selectedPack)))
      }), takeUntil(this.destroy$)
    ).subscribe(pack => {

      this.id = pack.code
      const product = pack.product
      this.form.patchValue({
        ...pack,
        image: pack.images.map((item: Attachment) => item.code),
        price: pack.price,
        product: product,
        status: pack.status === 'active' || pack.status === 1
      })

      console.log("productos key", pack.product)

      this.selectedEcommerce = this.parameterService.getValueByOther(pack?.ecommerce, 'ecommerce')

      const ecommerceValue = (pack?.ecommerce && pack.ecommerce.length > 0) ? pack.ecommerce[0] : '-';
      this.store.dispatch(new GetProductsToSelect(ecommerceValue))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          complete: () => {
            this.product = this.store.selectSnapshot(ProductState.selectProductToSelect);
            this.productsFiltered = this.product;
          }
        });

      if (pack.product && Array.isArray(pack.product) && pack.product.length > 0) {

        pack.product.forEach(item => { (this.form.get('product') as FormArray).push(this.initItemsProduct(item, null)) });

        this.tableConfig.data = (this.form.get('product') as FormArray).value

      }

    })
  }

  public prepareImages() {
    let images: Attachment[];
    images = this.form.controls['images'].value as Attachment[];
    if (Array.isArray(images) && images.length > 0) {
      return images
    }
    return null
  }


  private initForm() {

    this.form = this.formBuilder.group<PackForm>({
      code: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      reference: new FormControl(null, [Validators.required]),
      ecommerce: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required, FormValidator.AmountValidator]),
      stock: new FormControl(null, [Validators.required, FormValidator.PositiveIntegerValidator]),
      image: new FormControl([], Validators.required),
      images: new FormControl([]),
      product: this.formBuilder.array([] as PackProduct[]),
      status: new FormControl(null)
    })
  }


  public checkPrepareItem(): boolean {
    if (
      !this.tableSelectProduct ||
      !this.tableSelectProduct.code ||
      !this.tableSelectProduct.name ||
      !this.tableQuantity.value
    ) {
      return false
    }
    return true
  }


  public onAddProductOriginal() {
    if (!this.checkPrepareItem()) return

    this.productsFiltered = null;

    (this.form.get('product') as FormArray).push(this.initItemsProduct(null, this.tableSelectProduct));

    this.tableConfig.data = (this.form.get('product') as FormArray).value
    console.log((this.form.get('product') as FormArray).value)
    setTimeout(() => this.productsFiltered = this.product)

    this.tableSelectProduct = null
    this.tableQuantity.setValue(null)

  }


  public onAddProduct() {

    if (!this.checkPrepareItem()) return;

    const formArray = this.form.get('product') as FormArray;

    const newItem = this.initItemsProduct(null, this.tableSelectProduct);
    const newRef = newItem.get('reference').value; // o el campo correcto
    const newQty = Number(newItem.get('quantity').value);

    // Buscar si el producto ya existe
    const existingIndex = formArray.controls.findIndex(ctrl =>
      ctrl.get('reference').value === newRef
    );

    if (existingIndex !== -1) {
      const existingCtrl = formArray.at(existingIndex);
      const currentQty = Number(existingCtrl.get('quantity').value);

      existingCtrl.get('quantity').setValue(currentQty + newQty);
    } else {
      formArray.push(newItem);
    }

    // Refrescar grilla
    this.tableConfig.data = formArray.value;

    // Reset UI
    this.productsFiltered = null;
    setTimeout(() => this.productsFiltered = this.product);

    this.tableSelectProduct = null;
    this.tableQuantity.setValue(null);
  }


  private initItemsProduct(product?: PackProduct, select?: ProductToSelect) {

    const totalItems = (this.form.get('product') as FormArray).length

    return this.formBuilder.group<PackProducForm>({
      item: new FormControl(totalItems + 1),
      code: new FormControl(product?.code || 0),
      fk_product: new FormControl(product?.fk_product || select?.code || 0),
      quantity: new FormControl(product?.quantity || this.tableQuantity.value || 0),
      discount: new FormControl(product?.discount || 0),
      name: new FormControl(product?.name || select?.name),
      reference: new FormControl(product?.reference || select?.reference),
      delete: new FormControl(product?.delete || 0)
    })
  }



  onSelectProduct(event) {
    if (event) {
      this.tableSelectProduct = {
        code: event.value,
        name: event.options[0].label,
        reference: event.options[0].other.reference,
        status: event.options[0].other.status
      }
    }
  }

  onSearchProduct(event: Select2SearchEvent<Select2UpdateValue>) {
    const removeAccents = (value: string) =>
      value
        .normalize('NFD')                // separa acentos
        .replace(/[\u0300-\u036f]/g, '') // elimina acentos
        .toLowerCase();

    const search = removeAccents(event.search.trim());

    if (search.length < 3) {
      this.productsFiltered = this.product;
      return;
    }

    this.productsFiltered = this.product.filter(product => {
      const opt = product as any;

      const label = removeAccents(opt.label ?? '');
      const reference = removeAccents(opt.other.reference ?? '');

      return label.includes(search) || reference.includes(search);
    });

  }


  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'delete') {
      if (action.data?.code && action.data?.code > 0) {
        const items = (this.form.get('product') as FormArray)
        const index = items.value.findIndex((item: any) => item.code === action.data.code)
        if (index > -1) {
          this.tableDelete = [...this.tableDelete, items.value[index]]
          items.removeAt(index)
        }
        const renderItems = items.controls
        renderItems.forEach((item, index) => {
          item.get('item').setValue(index + 1)
        })
        this.tableConfig.data = (this.form.get('product') as FormArray).value

      } else {
        const items = (this.form.get('product') as FormArray)
        const index = items.value.findIndex((item: any) => item.item === action.data.item)
        if (index > -1) {
          items.removeAt(index)
        }
      }

      const items = (this.form.get('product') as FormArray).controls
      items.forEach((item, index) => {
        item.get('item').setValue(index + 1)
      })
      this.tableConfig.data = (this.form.get('product') as FormArray).value
    }

  }
  onSave() {
    if (!this.form.valid || this.form.controls['product'].value.length === 0) {
      this.notificationService.showError('Complete los campos requeridos', 'Aviso')
      FormService.markFormGroupTouched(this.form)
      return;
    }

    // Validar imagen obligatoria
    const hasNewFile = !!this.fileImage;
    const hasExistingImages = Array.isArray(this.form.controls['image'].value) && this.form.controls['image'].value.length > 0;

    if (!hasNewFile && !hasExistingImages) {
      this.notificationService.showError('Debe subir una imagen para continuar', 'Aviso');

      const imageCtrl = this.form.controls['image'];
      imageCtrl.setErrors({ required: true });
      imageCtrl.markAsTouched();
      imageCtrl.markAsDirty();

      return;
    }

    const fileImage$ = this.store.dispatch(new UploadFileImage(this.fileImage, 'formData', {
      vDescripcion: this.form.controls['name'].value,
      vModule: 'packs',
    }, true)).pipe(
      map((response) => response.file.selectedFile as Upload[])
    );



    forkJoin([fileImage$]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([fileImage]) => {

        let codeImages = fileImage?.map((item: Upload) => item.code) || []
        if (this.form.controls['image'].value) {
          codeImages = [...codeImages, ...this.form.controls['image'].value]
        } else {
          codeImages = [...codeImages]
        }
        codeImages = codeImages.filter((item) => item !== null)
        codeImages = codeImages && codeImages.length > 0 ? codeImages : null

        const tempForm = this.form

        if (this.tableDelete && Array.isArray(this.tableDelete) && this.tableDelete.length > 0) {
          // agregar a la lista de eliminados a product del formulario
          const product = tempForm.controls['product'] as FormArray
          this.tableDelete.forEach((item: PackProduct) => {
            item.delete = 1
            product.push(this.initItemsProduct(item, null))
          })
        }

        const data = {
          ...tempForm.value,
          image: codeImages,
          status: this.form.controls['status'].value === true || this.form.controls['status'].value === 1 ? 'active' : 'inactive'
        }

        let action = new CreatePack(data)
        if (this.type === 'edit') {
          action = new UpdatePack(data, this.id)
        }

        this.store.dispatch(action).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            const selected = this.store.selectSnapshot(PackState.selectedPack)
            if (response) {
              this.router.navigate(['/packs'])
            }
          }
        })

      }
    })

  }

  onSelectFile(event: any) {
    this.fileImage = event
    this.form.controls['image'].setErrors(null);
  }

  onFilesRegistered(event: Attachment[]) {
    console.log(event)
    if (event) {
      this.form.controls['image'].setValue(
        event.map((item: Attachment) => item.code)
      )
    } else {
      this.form.controls['image'].setValue(null)

    }
  }

}
