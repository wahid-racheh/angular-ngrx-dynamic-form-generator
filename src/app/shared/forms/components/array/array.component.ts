import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { addFormArray, isGroupControl, removeFormArrayAt } from '@app/shared/forms/helpers/form-helpers';

@Component({
  selector: 'app-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss']
})
export class ArrayComponent implements OnInit {
  @Input() public field: any;
  @Input() public group: FormGroup;

  public groups: any[];

  private get formArray(): FormArray {
    return this.group.get(this.field.key) as FormArray;
  }

  public ngOnInit() {
    const control: any = this.group.get(this.field.key);
    this.groups = control.controls;
  }

  public isGroup(control): boolean {
    return isGroupControl(control);
  }

  public addField(): void {
    addFormArray(this.formArray, this.field);
  }

  public removeField(index: number): void {
    removeFormArrayAt(this.formArray, index);
  }
}
