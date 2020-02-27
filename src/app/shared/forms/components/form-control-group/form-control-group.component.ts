import { Component, Input } from '@angular/core';

import { isGroupControl } from '@app/shared/forms/helpers/form-helpers';

@Component({
  selector: 'app-form-control-group',
  templateUrl: './form-control-group.component.html',
  styleUrls: ['./form-control-group.component.scss']
})
export class FormControlGroupComponent {
  @Input() public field: any;
  @Input() public group: any;

  public isGroup(control): boolean {
    return isGroupControl(control);
  }
}
