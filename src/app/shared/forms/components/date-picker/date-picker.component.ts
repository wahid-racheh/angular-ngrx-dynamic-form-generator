import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';

import { BaseInput } from '@app/shared/forms/classes/base-input.class';
import { NgxFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-date-picker-wrapper',
  template: `
    <app-date-picker
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [disabled]="field?.templateOptions?.disabled"
      [label]="field?.templateOptions?.label"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [placeholder]="field?.templateOptions?.placeholder"
      [defaultValue]="field?.extraOptions?.defaultValue"
      [minDate]="field?.extraOptions?.minDate"
      [maxDate]="field?.extraOptions?.maxDate"
      (onChange)="field?.templateOptions?.events?.onChange.emit($event)"
    ></app-date-picker>
  `,
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerWrapperComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: FormControl;
  @Output()
  public onChange: EventEmitter<void> = new EventEmitter();
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends BaseInput implements OnInit {
  constructor() {
    super();
  }

  @Input()
  public defaultValue: moment.Moment;
  @Input()
  public minDate: moment.Moment;
  @Input()
  public maxDate: moment.Moment;

  public ngOnInit() {
    if (this.group) {
      this.control = this.group.get(this.controlName) as FormControl;
      this.control.patchValue(this.defaultValue || null);
    }
  }

  public handleChange(date: moment.Moment): void {
    const newDate = moment()
      .clone()
      .year(date.year())
      .month(date.month())
      .date(date.date());
    this.onChange.emit(newDate);
  }
}
