import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';

import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';
import { NgxFormControlType, FormConfig, NgxAbstractFormControl } from '@app/shared/forms/interfaces/types';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-mock-form-control-field',
  template: `
    <app-form-control-field [field]="field" [group]="form"></app-form-control-field>
  `
})
export class MockFormControlFieldComponent {
  public form: FormGroup;
  public field: NgxAbstractFormControl;

  constructor() {
    const config: FormConfig = {
      controls: [
        {
          key: 'firstName',
          type: NgxFormControlType.TEXT,
          level: 1,
          isDynamic: true,
          templateOptions: {
            displayOrder: 0,
            label: 'firstName',
            placeholder: 'firstName'
          },
          validators: [Validators.required]
        }
      ]
    };

    const formConfig: NgxFormConfig = new NgxFormConfig(config);
    this.field = formConfig.controlsMap.firstName;
    this.form = new FormGroup({
      firstName: new FormControl('')
    });
  }
}

storiesOf('Shared|Forms/Components/FormControlFieldComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    moduleMetadata: {
      imports: [AppMockModules],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    },
    component: MockFormControlFieldComponent
  }));
