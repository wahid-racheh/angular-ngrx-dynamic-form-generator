import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BaseInput } from '@app/shared/forms/classes/base-input.class';
import { handleInputValueChangesEvent } from '@app/shared/forms/helpers/form-helpers';
import { FormFieldControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-text-input-wrapper',
  template: `
    <app-text-input
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [disabled]="field?.templateOptions?.disabled"
      [label]="field?.templateOptions?.label"
      [placeholder]="field?.templateOptions?.placeholder"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [defaultValue]="field?.templateOptions?.defaultValue"      
      [inputStyle]="field?.templateOptions?.inputStyle"
      [attributes]="field?.templateOptions?.attributes"
      (onBlur)="field?.templateOptions?.events?.onBlur.emit($event)"
      (onChange)="field?.templateOptions?.events?.onChange.emit($event)"
      (onFocus)="field?.templateOptions?.events?.onFocus.emit($event)"
    ></app-text-input>
  `,
  styleUrls: ['./text-input.component.scss']
})
export class TextInputWrapperComponent {
  @Input()
  public field: FormFieldControl;
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
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent extends BaseInput implements OnInit {
  
  @Input()
  public defaultValue: string;

  constructor() {
    super();
  }
  public ngOnInit(): void {
    if (this.group) {
      this.control = this.group.get(this.controlName) as FormControl;
      if (this.defaultValue) {
        this.control.patchValue(this.defaultValue, { onlySelf: true, emitEvent: false}); 
      }
      handleInputValueChangesEvent(
        this.control.valueChanges,
        this.debounceTime,
        this.unsubscribe$
      ).subscribe((changes: any) => this.handleChange(changes));
    }
  }

  public handleBlur(event: any): void {
    if (event.type === 'blur' || (event.type === 'keypress' && event.keyCode === 13)) {
      this.onBlur.emit(event);
    }
  }

  public handleFocus(event: any): void {
    if (event.type === 'focus') {
      this.onFocus.emit(event);
    }
  }

  public handleChange(event: any): void {
    this.onChange.emit(event);
  }
}
