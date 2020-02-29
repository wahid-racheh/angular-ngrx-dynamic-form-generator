import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NgxFormGroup } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.scss']
})
export class CustomerAddressComponent {
  @Input()
  public field: NgxFormGroup;
  @Input()
  public group: FormGroup;
}
