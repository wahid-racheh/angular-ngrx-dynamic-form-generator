import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { NgxFormControl } from '@app/shared/forms/interfaces/types';

/**
 * Referenced components in form config should be imported in the modules entryComponents
 */
@Component({
  selector: 'app-custom-text-component',
  template: `
    <app-text-input
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [label]="field.templateOptions?.label"
      [placeholder]="field.templateOptions?.placeholder"
      (onChange)="field.templateOptions?.events?.onChange($event)"
    ></app-text-input>
  `,
  styleUrls: []
})
export class CustomTextComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: AbstractControl;
}
