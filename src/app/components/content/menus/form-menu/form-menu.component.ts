import { ActivatedRoute, Router } from "@angular/router";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ContentMenuForm, ContentMenuModel } from "@shared/interface/content.interface";
import { CreateUpdateContentMenu, EdithContentMenu, GetContentMenu, GetContentPageSelect, SetEcommerceMenu } from "@shared/action/content.action";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { Observable, Subject, forkJoin, mergeMap, of, switchMap, takeUntil } from "rxjs";
import { Select, Store } from "@ngxs/store";

import { ContentState } from "@shared/state/content.state";
import { FormService } from "@shared/validator/form.service";
import { GetParameters } from "@shared/action";
import { NotificationService } from "@shared/services/index.service";
import { ParameterService } from "@shared/services/parameter.service";
import { ParameterState } from "@shared/state/parameter.state";
import { Select2DataFormat } from "@shared/interface";
import { typeForm } from "@shared/types/general.types";

@Component({
  selector: "app-form-menu",
  templateUrl: "./form-menu.component.html",
  styleUrl: "./form-menu.component.scss",
})
export class FormMenuComponent implements OnInit, OnDestroy {
  @Input() type: typeForm = "create";
  @Select(ContentState.menu) menus$: Observable<ContentMenuModel>;
  @Select(ParameterState.parametersSelect2("menu_position")) positions$: Observable<Select2DataFormat<string>[]>
  @Select(ContentState.selectPageSelect2) pagesSelect2$: Observable<Select2DataFormat<string>[]>

  public form: FormGroup
  public id: number
  public readonly Number = Number

  private destroy$ = new Subject<void>()

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private parameterService: ParameterService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initServices();
    this.prepareForm();
  }

  initServices() {

    forkJoin([
      this.store.dispatch(new GetParameters({ key: "menu_position" }))
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      complete: () => {

        this.route.params.pipe(
          switchMap(params => {

            if (!params['id']) return of();
            return this.store.dispatch(new EdithContentMenu(params['id']))
              .pipe(mergeMap(() => this.store.select(ContentState.selectedMenu)))
          }), takeUntil(this.destroy$)
        ).subscribe(menu => {

          // this.menu = menu
          this.id = menu.code

          const position = this.parameterService.getValueByOther(menu?.position, "menu_position").at(0)
          this.form.patchValue({
            ...menu,
            check_external_link: menu.check_external_link === 'yes',
            status: menu.status === 'active',
            position: position,
            parent_id: menu?.parent
          })

          this.store.dispatch(new GetContentMenu(menu?.ecommerce));
          this.store.dispatch(new GetContentPageSelect(menu?.ecommerce));
          this.store.dispatch(new SetEcommerceMenu(menu?.ecommerce));

        })

      }
    })

  }

  private prepareForm() {
    this.form = this.formBuilder.group<ContentMenuForm>({
      code: new FormControl(null),
      ecommerce: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      position: new FormControl(null, [Validators.required]),
      parent: new FormControl(null),
      check_external_link: new FormControl(null),
      fk_content: new FormControl(null),
      link_external: new FormControl(null),
      reference: new FormControl(null),
      status: new FormControl(null),

      parent_id: new FormControl(null),
    });
  }

  get checkExternalLink(): boolean {
    return this.form.controls['check_external_link'].value
  }

  getFieldForm(field: string) {
    return this.form.get(field).value
  }

  onSelectMenuItem(data: number[]) {
    const menuSelected = Array.isArray(data) && data.length ? data[0] : 0
    if (menuSelected) {
      this.form.controls['parent'].setValue(menuSelected)
      this.form.controls['parent_id'].setValue(menuSelected)
    } else {
      this.form.controls['parent'].setValue(null)
      this.form.controls['parent_id'].setValue(null)
    }
  }


  onSave() {

    const ecommerce = this.store.selectSnapshot(ContentState.selectedEcommerce);
    if (ecommerce) {
      this.form.get("ecommerce").setValue(ecommerce);
    }
    if (this.form.invalid) {
      this.notificationService.showError('Complete los campos requeridos', 'Aviso')
      FormService.markFormGroupTouched(this.form)
      return;
    }

    const parent = Number(this.form.get("parent").value)

    const position = this.parameterService.getOtherByValue(this.form.get("position").value, "menu_position").at(0)
    const data = {
      ...this.form.value,
      code: this.form.get("code").value ? Number(this.form.get("code").value) : 0,
      check_external_link: this.form.get("check_external_link").value ? 'yes' : 'no',
      fk_content: !this.form.get("check_external_link").value && this.form.get("fk_content").value ? Number(this.form.get("fk_content").value) : null,
      status: this.form.get("status").value === true || this.form.get("status").value === 1 ? 'active' : 'inactive',
      position: position || null,
      parent: parent <= 0 ? null : parent,

    }

    this.store.dispatch(new CreateUpdateContentMenu(data))

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
