import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TextInputComponent } from '@app/shared/forms/components/text-input/text-input.component';
import { NgxFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-text-area-wrapper',
  template: `
    <app-text-area
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [disabled]="field?.templateOptions?.disabled"
      [label]="field?.templateOptions?.label"
      [placeholder]="field?.templateOptions?.placeholder"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [inputStyle]="field?.templateOptions?.inputStyle"
      (onBlur)="field?.templateOptions?.events?.onBlur?.emit($event)"
      (onChange)="field?.templateOptions?.events?.onChange?.emit($event)"
      (onFocus)="field?.templateOptions?.events?.onFocus?.emit($event)"
    ></app-text-area>
  `,
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaWrapperComponent {
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
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent extends TextInputComponent {
  constructor() {
    super();
  }
}
