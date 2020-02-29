import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { NgxFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-custom-template',
  template: `
    <ng-container *ngIf="field?.htmlTemplate">
      <div [innerHTML]="field?.htmlTemplate | safeHtml"></div>
    </ng-container>
  `,
  styleUrls: []
})
export class CustomTemplateComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: AbstractControl;
}

