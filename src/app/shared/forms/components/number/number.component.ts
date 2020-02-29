import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TextInputComponent } from '@app/shared/forms/components/text-input/text-input.component';
import { NgxFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-number-wrapper',
  template: `
    <app-number
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [disabled]="field?.templateOptions?.disabled"
      [label]="field?.templateOptions?.label"
      [placeholder]="field?.templateOptions?.placeholder"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [inputStyle]="field?.templateOptions?.inputStyle"
      [attributes]="field?.templateOptions?.attributes"
      (onBlur)="field?.templateOptions?.events?.onBlur.emit($event)"
      (onChange)="field?.templateOptions?.events?.onChange.emit($event)"
      (onFocus)="field?.templateOptions?.events?.onFocus.emit($event)"
    ></app-number>
  `,
  styleUrls: ['./number.component.scss']
})
export class NumberWrapperComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: FormControl;

  @Output()
  public onBlur: EventEmitter<void> = new EventEmitter();
  @Output()
  public onChange: EventEmitter<void> = new EventEmitter();
  @Output()
  public onFocus: EventEmitter<void> = new EventEmitter();
}

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent extends TextInputComponent {
  constructor() {
    super();
  }
}
