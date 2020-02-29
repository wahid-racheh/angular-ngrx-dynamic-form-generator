import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { get } from 'lodash';

import { BaseInput } from '@app/shared/forms/classes/base-input.class';
import { handleInputValueChangesEvent } from '@app/shared/forms/helpers/form-helpers';
import { NgxFormControl } from '@app/shared/forms/interfaces/types';
import { isEmpty } from '@app/shared/forms/utils/form-utils';

@Component({
  selector: 'app-radio-group-wrapper',
  template: `
    <app-radio-group
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
      [selectedValue]="field?.extraOptions?.selectedValue"
      [optionKey]="field?.extraOptions?.optionKey"
      [optionValue]="field?.extraOptions?.optionValue"
      (onChange)="field?.templateOptions?.events?.onChange?.emit($event)"
    ></app-radio-group>
  `,
  styleUrls: ['./radio-group.component.scss']
})
export class RadioGroupWrapperComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: FormControl;
  @Output()
  public onChange: EventEmitter<void> = new EventEmitter();
}

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss']
})
export class RadioGroupComponent extends BaseInput implements OnInit {
  @Input()
  public selectedValue: any;
  @Input()
  public refIndex: number;
  @Input()
  public optionKey: string = 'key';
  @Input()
  public optionValue: string = 'value';
  @Input()
  public data: any[];

  @Input()
  public displayInline: boolean;

  constructor() {
    super();
  }

  public ngOnInit(): void {
    if (this.group) {
      this.control = this.group.get(this.controlName) as FormControl;
      handleInputValueChangesEvent(
        this.control.valueChanges,
        10,
        this.unsubscribe$
      ).subscribe((changes: any) => this.handleChange(changes));
      if (!isEmpty(this.selectedValue) && isEmpty(this.control.value)) {
        this.control.setValue(this.selectedValue[this.optionValue], { emitEvent: false });
      }
    }
  }

  private handleChange(value: any): void {
    if (!isEmpty(value)) {
      const element: any = this.data.find(item => item[this.optionValue] === value);
      this.onChange.emit({
        ...element,
        index: get(this.group, 'value.index')
      });
    }
  }
}
