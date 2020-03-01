import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { isCustomTemplate } from '../../helpers/form-helpers';
import { NgxFormControl } from '../../interfaces/types';

@Component({
  selector: 'app-form-control-field',
  templateUrl: './form-control-field.component.html',
  styleUrls: ['./form-control-field.component.scss']
})
export class FormControlFieldComponent {
  @Input() public field: NgxFormControl;
  @Input() public group: AbstractControl;

  public get isCustomTemplate() {
    return isCustomTemplate(this.field);
  }
}
