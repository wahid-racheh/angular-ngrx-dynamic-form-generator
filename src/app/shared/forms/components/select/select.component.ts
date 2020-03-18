import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BaseInput } from '@app/shared/forms/classes/base-input.class';
import { NgxFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-select-wrapper',
  template: `
    <app-select
      class="d-flex w-100"
      [group]="group"
      [disabled]="field?.templateOptions?.disabled"
      [controlName]="field.key"
      [label]="field?.templateOptions?.label"
      [description]="field?.templateOptions?.description"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [inputStyle]="field?.templateOptions?.inputStyle"
      [placeholder]="field?.templateOptions?.placeholder"
      [data]="field?.extraOptions?.data"
      [selectedValue]="field?.extraOptions?.selectedValue"
      [optionKey]="field?.extraOptions?.optionKey"
      [optionValue]="field?.extraOptions?.optionValue"
      (onChange)="field?.templateOptions?.events?.onChange.emit($event)"
    ></app-select>
  `,
  styleUrls: ['./select.component.scss']
})
export class SelectWrapperComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: FormControl;
  @Output()
  public onChange: EventEmitter<void> = new EventEmitter();
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent extends BaseInput implements OnInit {
  @Input()
  public selectedValue: any;
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
      this.control.setValue(this.selectedValue, { emitEvent: false });
    }
  }

  public handleChange(event: any): void {
    const { value } = event;
    if (value !== null && value !== undefined) {
      const element: any = this.data.find(item => item[this.optionValue] === value);
      this.onChange.emit(element);
    }
  }
}
