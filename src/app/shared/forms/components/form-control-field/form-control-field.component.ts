import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-control-field',
  templateUrl: './form-control-field.component.html',
  styleUrls: ['./form-control-field.component.scss']
})
export class FormControlFieldComponent {
  @Input() public field: any;
  @Input() public group: any;
}
