import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { isGroupControl } from '@app/shared/forms/helpers/form-helpers';

@Component({
  selector: 'app-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.css']
})
export class ArrayComponent implements OnInit {
  @Input() public field: any;
  @Input() public group: FormGroup;

  public groups: any[];

  public ngOnInit() {
    const control: any = this.group.get(this.field.key);
    this.groups = control.controls;
  }

  public isGroup(control): boolean {
    return isGroupControl(control);
  }
}
