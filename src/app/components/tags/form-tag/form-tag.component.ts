import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CreateTag, EditTag, UpdateTag } from '../../../shared/action/tag.action';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import { Store } from '@ngxs/store';
import { Tag } from "../../../shared/interface/tag.interface";
import { TagState } from '../../../shared/state/tag.state';
import { TypeForm } from '@shared/types/util.types';

@Component({
  selector: 'app-form-tag',
  templateUrl: './form-tag.component.html',
  styleUrls: ['./form-tag.component.scss']
})
export class FormTagComponent implements OnInit, OnDestroy {

  @Input() type: TypeForm;

  public form: FormGroup;
  public tag: Tag | null;
  public id: number;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {

    this.initForm();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      status: new FormControl()
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const _id = params["id"] || 0;

          if( _id <=0) {
            return of(null);
          }

          return this.store
            .dispatch(new EditTag(_id))
            .pipe(
              mergeMap(() =>
                this.store.select(TagState.selectedTag)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((tag) => {
        this.id = tag.code
        this.form.patchValue({
          ...tag,
          status: tag?.status === 'active' ? 1 : 0,
        })
      });
  }

  onSave(){
    this.form.markAllAsTouched();

    const data = {
      ...this.form.getRawValue(),
      status: (this.form.controls['status'].value === 1 || this.form.controls['status'].value === true) ? 'active' : 'inactive',
    }
    let action = new CreateTag(data);
    if (this.type === 'edit' && this.id) {
      action = new UpdateTag(data, this.id)
    }

    if (this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete : () => {
          this.router.navigate(['/tags']);
        }
      });
    }


  }


}