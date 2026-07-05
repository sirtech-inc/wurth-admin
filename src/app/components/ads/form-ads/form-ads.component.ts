import { ActivatedRoute, Router } from '@angular/router';
import { AdsForm, AdsPosition, AdsPositionResponseOrList, Design } from '@shared/interface/ads.interface';
import { AdvanceDropDownFormat, Attachment } from '@shared/interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CreateAds, EditAds, GetDesign, ResetAds, UpdateAds } from '@shared/action/ads.action';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, forkJoin, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { OptionalAll, TypeForm } from 'src/app/shared/types/util.types';
import { Select, Store } from '@ngxs/store';

import { AdsState } from '@shared/state/ads.state';
import { FormService } from '@shared/validator/form.service';
import { GetParameters } from '@shared/action/parameter.action';
import { NotificationService } from '@shared/services/index.service';
import { ParameterService } from '@shared/services/parameter.service';
import { ParameterState } from '@shared/state/parameter.state';
import { Select2Data } from 'ng-select2-component';
import { AdsService } from '@shared/services/ads.service';

@Component({
  selector: 'app-form-ads',
  templateUrl: './form-ads.component.html',
  styleUrl: './form-ads.component.scss'
})
export class FormAdsComponent implements OnInit, OnDestroy {

  @Select(AdsState.selectDesgin) designs$!: Observable<Design[]>
  @Select(ParameterState.parametersAdvanceDropDown('ecommerce')) ecommerce$: Observable<AdvanceDropDownFormat<string>[]>


  @Input() type: TypeForm;
  public form: FormGroup<AdsForm>
  positions: string[] = []
  public selectedEcommerce: number[] = [];
  private destroy$ = new Subject<void>();
  private fileImages: OptionalAll<AdsPosition>[] = [];
  public id: number;
  public adsPositions: AdsPositionResponseOrList[] = []


  public readonly adsType: Select2Data = [
    {
      value: 'slider',
      label: 'SLIDER',
    }, {
      value: 'banner',
      label: 'BANNER',
    },
  ]


  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private parameterService: ParameterService,
    private bannerService: AdsService
  ) { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.initForm()
    this.initServices()
    this.form.controls['type'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.store.dispatch(new GetDesign({ type_banner: value.toLowerCase() }))
      }
    })

    this.store.select(AdsState.selectedAdsPosition).pipe(takeUntil(this.destroy$)).subscribe((positions) => {
      this.adsPositions = positions
    })
  }

  private initServices() {
    const ecommerce$ = this.store.dispatch(new GetParameters({ key: 'ecommerce' }));
    this.route.params
      .pipe(
        switchMap(params => {

          this.store.dispatch(new ResetAds())

          if (!params['id']) return of();
          return this.store.dispatch(new EditAds(params['id']))
            .pipe(mergeMap(() => this.store.select(AdsState.selectedAds)))

        }
        ),
        takeUntil(this.destroy$)
      ).subscribe(ads => {

        forkJoin([ecommerce$]).subscribe({
          complete: () => {

            this.store.select(AdsState.selectDesgin).pipe(takeUntil(this.destroy$)).subscribe((designs) => {
              this.positions = designs.filter(design => design.code === ads.fk_code_design)[0].position
            })

            this.id = ads.code
            this.form.patchValue({
              ...ads,
              status: ads.status === 'active' || ads.status === 1 ? true : false
            })
            this.selectedEcommerce = this.parameterService.getValueByOther(ads.ecommerce, 'ecommerce') //.getIdByOther(ads.ecommerce)
            if (this.id && this.type === 'edit') {
              FormService.enableDisableSpecificFields(this.form, ['type'], false)
            }
          }
        })

      })
  }

  prepareImage(position: string): Attachment {

    // if (!position) return null;
    const selected = this.adsPositions?.find(item => item.position === position)

    if (selected?.code && selected?.code > 0 && selected?.original_url) {
      const extension = selected.file_name.split('.').pop()
      return {
        code: selected.code,
        original_url: selected.original_url,
        name: selected.name,
        mime_type: selected.mime_type,
        size: selected.size,
        extension: extension,
        file_name: selected.file_name,
        description: null
      }
    }
    return null;
  }

  onSelectedDesign({ position }: Design) {
    this.positions = position
  }

  removeImage = (file: Attachment, index: number) => {
    console.log("Archivo eliminado externamente:", file, index);

    if (!file.code) {
      console.warn("⚠ No hay code para eliminar en el backend");
      // Elimina localmente si no tiene code
      this.adsPositions = this.adsPositions.filter(
        (item) => item.position !== this.positions[index]
      );
      this.fileImages = this.fileImages.filter(
        (img) => img.v_position !== this.positions[index]
      );
      return;
    }

    this.bannerService.deleteBannerPosition(file.code).subscribe({
      next: (res) => {
        this.adsPositions = this.adsPositions.filter(
          (item) => item.code !== file.code
        );

        // 🔹 2. Quitar de fileImages (si existe ahí también)
        this.fileImages = this.fileImages.filter(
          (img) => img.code !== file.code
        );
        console.log("✅ Eliminado en backend:", res);
        // Aquí puedes actualizar el array de imágenes localmente si quieres
      },
      error: (err) => {
        console.error("❌ Error al eliminar:", err);
      }
    });
  };
  onSelectEcommerceItem(data: number[]) {
    const selected = this.parameterService.getOtherByValue(data, 'ecommerce') //.getOtherById(data)
    if (selected && Array.isArray(selected) && selected.length > 0) {
      this.form.controls['ecommerce'].setValue(selected);
    } else {
      this.form.controls['ecommerce'].setValue(null);
    }
  }

  private initForm() {
    this.form = this.formBuilder.group<AdsForm>({
      name: new FormControl(null, [Validators.required]),
      ecommerce: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      status: new FormControl(null),
      fk_code_design: new FormControl(null, [Validators.required])
    })
  }

  async onSelectFiles(event: any, position: string) {
    const image = await this.convertToBase64(event)
    this.fileImages.push({
      imagen: image as string,
      v_fk_banner: 0,
      v_position: position
    })
  }

  private convertToBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let base64String = reader.result as string;
        base64String = base64String.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  onSave() {
    console.log(this.adsPositions)
    if (!this.form.valid) {
      this.notificationService.showError('Complete los campos requeridos', 'Aviso')
      FormService.markFormGroupTouched(this.form)
      return;
    }

    const hasValidImage =
      (this.fileImages && this.fileImages.some(img => img.imagen || img.code)) ||
      (this.adsPositions && this.adsPositions.some(pos => pos.code > 0));

    if (!hasValidImage) {
      this.notificationService.showError(
        'Debe ingresar al menos una imagen antes de guardar',
        'Aviso'
      );
      return;
    }

    /*if (!this.fileImages || this.fileImages.length === 0) {
      this.notificationService.showError('Debe ingresar al menos una imagen', 'Aviso');
      FormService.markFormGroupTouched(this.form);
      return;
    }*/

    const lastPosition = this.positions[this.positions.length - 1]
    this.fileImages = this.fileImages.filter(data => data.v_position <= lastPosition)
      .map((item) => {
        return {
          ...item,
          v_fk_banner: this.id
        }
      })



    if (this.adsPositions?.length > 0) {

      this.adsPositions.forEach((item) => {
        const index = this.fileImages.findIndex(position => position.v_position === item.position)
        if (index === -1) {
          this.fileImages.push({
            imagen: null,
            v_fk_banner: this.id,
            v_position: item.position,
            code: item.code
          })
        } else {
          const image = this.fileImages[index]
          console.log("image else", image)
          this.fileImages[index] = {
            imagen: image.imagen,
            v_fk_banner: this.id,
            v_position: image.v_position,
            code: item.code
          }
        }
      })
    }

    const data = {
      ads: {
        ...this.form.getRawValue(),
        status: this.form.controls['status'].getRawValue() === 1 || this.form.controls['status'].getRawValue() === true ? 'active' : 'inactive'
        //  this.form.controls['status'].getRawValue().toString().toLowerCase()//.toLowerCase(),
      },
      positions: this.fileImages
    }

    if (this.type != 'edit') {
      this.bannerService.bannerValid(data.ads.type).subscribe(res => {
        console.log("res", res)
        if (res === 1) {
          this.notificationService.showError('Ya existe un registro con ese tipo de elemento', 'Aviso')
          return
        } else {
          let action = new CreateAds(data);

          if (this.type === 'edit') {
            action = new UpdateAds(data, this.id)
          }

          this.store.dispatch(action).subscribe({
            next: (response) => {
              const selected = this.store.selectSnapshot(AdsState.selectedAds);
              if (selected.code > 0) {
                this.router.navigate(['/ads']);
              }
            }
          })
        }
      });
    } else {
      let action = new CreateAds(data);

      if (this.type === 'edit') {
        action = new UpdateAds(data, this.id)
      }

      this.store.dispatch(action).subscribe({
        next: (response) => {
          const selected = this.store.selectSnapshot(AdsState.selectedAds);
          if (selected.code > 0) {
            this.router.navigate(['/ads']);
          }
        }
      })
    }


  }


}