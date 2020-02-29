import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { merge } from 'lodash';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil, tap } from 'rxjs/operators';

import { unsubscribe } from '@app/core/utils/utils';
import { FormsFacade } from '@app/shared/forms/+store/forms.facade';
import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';
import {
  addFormArray,
  buildForm,
  isGroupControl,
  normalizeFormControlValues,
  validateAllFormFields
} from '@app/shared/forms/helpers/form-helpers';
import { NgxAbstractFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-form',
  templateUrl: './app-form.component.html'
})
export class FormComponent implements OnDestroy {

  @Input() public formConfig$: Observable<NgxFormConfig>;
  @Input() public data$: Observable<any>;
  @Input() public form: FormGroup;
  @Input() public touchedForm$: Observable<boolean>;
  @Output() public onUpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() public onInitForm: EventEmitter<any> = new EventEmitter();
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  public formConfig: NgxFormConfig;
  public unsubscribe$: Subject<void> = new Subject();
  public unsubscribeDataInitialization$: Subject<void> = new Subject();
  public resetFlag$: Observable<boolean> = this.formsFacade.resetFlag$;

  public controls: NgxAbstractFormControl[];

  get isValid(): boolean {
    if (!this.form.valid) {
      validateAllFormFields(this.form);
      return false;
    }
    return true;
  }

  constructor(private formsFacade: FormsFacade) {
    this.resetFlag$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      if (this.form) {
        setTimeout(() => {
          this.form.reset({ emitEvent: false });
        });
      }
    });
  }

  public ngOnInit() {
    if (this.formConfig$) {
      this.formConfig$
        .pipe(
          map(f => this.buildForm(f)),
          tap(f => (this.form = f)),
          tap(f => this.onInitForm.emit(f)),
          tap(f => this.listenFormChanges(f)),
          f$ => combineLatest([f$, this.data$]),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(this.patchValue);

      if (this.data$) {
        // This is a workaround to force initializing form values
        this.data$.pipe(takeUntil(this.unsubscribeDataInitialization$)).subscribe((data: any) => {
          if (this.form) {
            this.updateFormMetadata(this.form, data);
            const timeout = setTimeout(() => {
              this.form.patchValue(data, { emitEvent: false });
              this.formsFacade.setForm(this.form);
              // Unsubscribe this event once form values initialized
              this.unsubscribeDataInitialization$.next();
              this.unsubscribeDataInitialization$.complete();
              clearTimeout(timeout);
            }, 0);
          }
        });
      }
    }

    if (this.touchedForm$) {
      this.touchedForm$
        .pipe(
          filter(t => !t && !!this.form),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(_ => this.form.reset());
    }
  }

  public handleOnSubmit(value) {
    const valid: boolean = this.isValid;
    if (valid) {
      this.formsFacade.setData(value);
    }
    this.onSubmit.emit({
      valid,
      value
    });
  }

  private buildForm(formConfig: any): FormGroup {
    this.formConfig = formConfig;
    if (formConfig) {
      const { controls } = formConfig;
      this.controls = controls;
      return buildForm(controls);
    }    
    return new FormGroup({});
  }

  // Iterate over form controls recursively and
  // Add missing arrays items
  public updateFormMetadata(control: any, data: any): void {
    Object.keys(control.controls).forEach((key: string) => {
      const abstractControl: any = control.controls[key];
      const field: any = this.formConfig.controlsMap[key];
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        if (abstractControl instanceof FormArray) {
          // Merge data and control values to get all array items
          const values = merge(data[key], abstractControl.value);
          this.initFormArray(abstractControl, field, values);
        }
        // Iterate over nested controls
        this.updateFormMetadata(abstractControl, data);
      }
    });
  }

  // Add missing items, In case we found in merged values more items then in the control values
  private initFormArray(abstractControl: FormArray, field: any, values) {
    if (field && values.length > abstractControl.value.length) {
      let diffCount = values.length - abstractControl.value.length;
      while (diffCount > 0) {
        addFormArray(abstractControl, field);
        diffCount -= 1;
      }
    }
  }

  private patchValue = ([form, data]): void => {
    !!data
      ? form.patchValue(data, { emitEvent: false })
      : form.patchValue({}, { emitEvent: false });

      this.formsFacade.setForm(this.form);
  };

  private listenFormChanges(form: FormGroup) {
    form.valueChanges
      .pipe(debounceTime(100), takeUntil(this.unsubscribe$))
      .subscribe((changes: any) => {
        this.onUpdateForm.emit(changes);
      });
  }

  public ngOnDestroy() {
    unsubscribe(this.unsubscribe$);
    unsubscribe(this.unsubscribeDataInitialization$);
  }
}

@Component({
  selector: 'app-form-content',
  templateUrl: './form-content.component.html',
  styleUrls: []
})
export class FormContentComponent {
  
  @Input()
  public form: FormGroup;
  @Input()
  public controls: NgxAbstractFormControl[];
  
  public isGroup(control): boolean {
    return isGroupControl(control);
  }
}
