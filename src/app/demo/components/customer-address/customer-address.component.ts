import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormGroupControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.scss']
})
export class CustomerAddressComponent {
  @Input()
  public field: FormGroupControl;
  @Input()
  public group: FormGroup;
}
