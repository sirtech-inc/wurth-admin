import {AdvanceDropDownFormat, Attachment, Category, CategoryForm, Images} from '@shared/interface';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
    EditCategory,
    GetCategories,
    GetCategoriesByEcommerce,
    ResetCategory,
    SaveCategory,
    SetEcommerce
} from '@shared/action';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {map, mergeMap, switchMap, takeUntil} from 'rxjs/operators';

import {ActivatedRoute, Router} from '@angular/router';
import {CategoryState} from '@shared/state/category.state';
import {GetParameters} from '@shared/action/parameter.action';
import {ParameterService} from '@shared/services/parameter.service';
import {ParameterState} from '@shared/state/parameter.state';
import {UploadFileImage} from '@shared/action/file-image.action';

@Component({
    selector: 'app-form-category',
    templateUrl: './form-category.component.html',
    styleUrls: ['./form-category.component.scss']
})
export class FormCategoryComponent implements OnInit, OnDestroy {

    @Input() type: string;
    @Input() categories: Category[];
    @Select(ParameterState.parametersAdvanceDropDown('ecommerce')) ecommerce$: Observable<AdvanceDropDownFormat<string>[]>;
    @Select(CategoryState.selectedEcommerce) selectedEcommerce$: Observable<string>;

    private destroy$ = new Subject<void>();
    public readonly typeModule = 'product'
    public form: FormGroup;
    public category: Category;
    public selectedEcommerce: number[] = [];
    private fileImage: File = null;
    private fileIcon: File = null;


    constructor(private store: Store,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private parameterService: ParameterService,
                private router:Router
    ) {

        this.initPrepareForm()

    }

    ngOnInit() {
        const ecommerce$ = this.store.dispatch(new GetParameters({key: 'ecommerce'}))

        this.route.params
            .pipe(
                switchMap(params => {
                        return this.store
                            .dispatch(new EditCategory(params['id']))
                            .pipe(mergeMap(() => this.store.select(CategoryState.selectedCategory)))
                    }
                ),
                takeUntil(this.destroy$)
            ).subscribe(category => {

            forkJoin([ecommerce$]).subscribe({

                complete: () => {

                    this.category = category!;

                    if (!category?.ecommerce) {
                        const categories = this.store.selectSnapshot( ParameterState.parameters('ecommerce', 'letter')).at(0)
                        this.store.dispatch( new GetCategoriesByEcommerce(categories.value))
                        this.store.dispatch( new SetEcommerce(categories.value) )

                    } else {
                        this.store.dispatch( new GetCategoriesByEcommerce(category.ecommerce))
                        this.store.dispatch( new SetEcommerce(category.ecommerce) )
                    }

                    this.form.patchValue({
                        ...category,
                        status: category?.status === 'active' ? 1 : 0,
                    })

                    this.selectedEcommerce = this.parameterService.getValueByOther(category?.ecommerce, 'ecommerce')
                }
            })
        });
    }

    onSelectCategoryItem(data: number[]) {
        if (Array.isArray(data) && data.length) {
            this.form.controls['parent_id'].setValue(data[0]);
        } else {
            this.form.controls['parent_id'].setValue(0);
        }
    }

    onSelectEcommerceItem(data: number[]) {
        const selected = this.parameterService.getOtherByValue(data, 'ecommerce') //.getOtherById(data)
        if (selected && Array.isArray(selected) && selected.length > 0) {
            this.form.controls['ecommerce'].setValue(selected);
        } else {
            this.form.controls['ecommerce'].setValue(null);
        }
    }

    onSelectFile(event, type: 'image' | 'icon') {
        if (type === 'image') {
            this.fileImage = event;
        } else {
            this.fileIcon = event;
        }
    }

    prepareImage(): Attachment {
        const code = this.form.controls['fk_imagen_image'].value
        if (!code) return null

        const images = this.form.controls['images'].value
        const findImage = images.find((item: Attachment) => item.code === code) as Images
        if (!findImage) return null

        return {
            ...findImage,
            original_url: findImage?.original_url,
            extension: findImage?.file_name.split('.').pop(),
            name: findImage?.description
        }
    }

    prepareIcon(): Attachment {
        const code = this.form.controls['fk_imagen_icon'].value
        if (!code) return null

        const images = this.form.controls['images'].value
        const findImage = images.find((item: Attachment) => item.code === code) as Images
        if (!findImage) return null

        return {
            ...findImage,
            original_url: findImage?.original_url,
            extension: findImage?.file_name.split('.').pop(),
            name: findImage?.description,
            size: findImage?.size
        }

    }

    initPrepareForm() {
        this.form = this.formBuilder.group<CategoryForm>({
            code: new FormControl(0),
            name: new FormControl('', [Validators.required]),
            description: new FormControl(),
            parent_id: new FormControl(0, [Validators.required]),
            fk_imagen_image: new FormControl(null),
            fk_imagen_icon: new FormControl(null),
            status: new FormControl(),
            images: new FormControl(null),
            priority: new FormControl(0),
        });
    }

    onSave() {
        if (this.form.controls['parent_id'].value === null) {
            this.form.controls['parent_id'].setValue(0)
        }

        this.form.markAllAsTouched();


        const fileImage$ = this.store.dispatch(new UploadFileImage(this.fileImage, 'queryString', {
            vDescripcion: this.form.controls['name'].value,
            vModule: 'category',
        })).pipe(
            map((response) => response.file.selectedFile as Images)
        )

        const fileIcon$ = this.store.dispatch(new UploadFileImage(this.fileIcon, 'queryString', {
            vDescripcion: this.form.controls['name'].value,
            vModule: 'category',
        })).pipe(
            map((response) => response.file.selectedFile as Images)
        )

        if (this.form.valid) {

            forkJoin([fileImage$, fileIcon$]).subscribe({
                next: ([fileImage, fileIcon]) => {

                    const _fk_image = this.form.controls['fk_imagen_image'].value === 0 ? null : this.form.controls['fk_imagen_image'].value
                    const _fk_icon = this.form.controls['fk_imagen_icon'].value === 0 ? null : this.form.controls['fk_imagen_icon'].value

                    const data: Category = {
                        ...this.form.getRawValue(),
                        ecommerce : this.store.selectSnapshot(CategoryState.selectedEcommerce),
                        status: this.form.value.status === true || this.form.value.status === 1 ? 'active' : 'inactive',
                        description: this.form.value.description || '',
                        fk_imagen_image: fileImage?.code ?? _fk_image,
                        fk_imagen_icon: fileIcon?.code ?? _fk_icon,
                        priority: this.form.value.priority || 0,
                    }

                    const action = new SaveCategory(data)
                    this.store.dispatch(action)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (response) => {
                                const selected = this.store.selectSnapshot(CategoryState.selectedCategory);
                                if (selected && selected?.code > 0) {
                                    this.selectedEcommerce = null
                                    this.store.dispatch(new ResetCategory())
                                    this.form.reset()
                                    this.router.navigate(['/category'])
                                }
                            }
                        });

                }
            })

        }


    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}


