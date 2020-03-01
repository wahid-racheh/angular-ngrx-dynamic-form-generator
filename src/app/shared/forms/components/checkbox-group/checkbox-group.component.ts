import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';

import { BaseInput } from '@app/shared/forms/classes/base-input.class';
import {
  getCheckboxStaticGroup,
  handleInputValueChangesEvent
} from '@app/shared/forms/helpers/form-helpers';
import { NgxFormControl } from '@app/shared/forms/interfaces/types';
import { isEmpty } from '@app/shared/forms/utils/form-utils';

@Component({
  selector: 'app-checkbox-group-wrapper',
  template: `
    <app-checkbox-group
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [disabled]="field?.templateOptions?.disabled"
      [label]="field?.templateOptions?.label"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [inputStyle]="field?.templateOptions?.inputStyle"
      [placeholder]="field?.templateOptions?.placeholder"
      [data]="field?.extraOptions?.data"
      [displayInline]="field?.extraOptions?.displayInline"
      [selectedValues]="field?.extraOptions?.selectedValues"
      [optionKey]="field?.extraOptions?.optionKey"
      [optionValue]="field?.extraOptions?.optionValue"
      (onChange)="field?.templateOptions?.events?.onChange.emit($event)"
    ></app-checkbox-group>
  `,
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupWrapperComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: FormControl;
  @Output()
  public onChange: EventEmitter<void> = new EventEmitter();
}

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent extends BaseInput implements OnInit {
  constructor() {
    super();
  }

  @Input()
  public selectedValues: any[] = [];
  @Input()
  public optionKey: string = 'key';
  @Input()
  public optionValue: string = 'value';
  @Input()
  public data: any[];
  @Input()
  public displayInline;

  private preventInitialization = false;

  public ngOnInit(): void {
    if (this.group) {
      this.initFormArray();
      handleInputValueChangesEvent(
        this.controlArray.valueChanges,
        10,
        this.unsubscribe$
      ).subscribe((changes: any) => this.handleChange(changes));
    }
  }

  public get controlArray(): FormArray {
    return this.group.get(this.controlName) as FormArray;
  }

  private initFormArray(): void {
    if (this.group) {
      this.preventInitialization = false;
      if (!this.controlArray.value.length) {
        this.data.forEach((item: any) => {
          this.controlArray.push(getCheckboxStaticGroup(item[this.optionKey], item[this.optionValue], false));
        });
      }
      this.initSelectedValues();
    }
  }

  private initSelectedValues(): void {
    if (this.selectedValues && !!this.selectedValues.length) {
      this.controlArray.controls.forEach((control: AbstractControl) => {
        const elem: any = this.selectedValues.find(item => item[this.optionValue] === control.value.value);
        if (!isEmpty(elem)) {
          control.patchValue(
            {
              ...control.value,
              selected: true
            },
            { onlySelf: true, emitEvent: false }
          );
        }
      });
    }
  }

  private handleChange(values: any[]): void {
    const emptyValues = values.filter(item => item.value === null && item.selected === null);
    if (!!emptyValues.length && !this.preventInitialization) {
      this.preventInitialization = true;
      while (this.controlArray.length) {
        this.controlArray.removeAt(0);
      }
      this.initFormArray();
    } else {
      const items: any = values.filter(item => item.selected);
      this.onChange.emit(items);
    }
  }
}
