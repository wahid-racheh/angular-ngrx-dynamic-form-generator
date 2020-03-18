import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';

import { INgxFormConfig, NgxFormConfig } from '@app/shared/forms/classes/form-config.class';
import { NgxAbstractFormControl, NgxFormControlType } from '@app/shared/forms/interfaces/types';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-mock-form-control-group',
  template: `
    <app-form-control-group [field]="field" [group]="form"></app-form-control-group>
  `
})
export class MockFormControlGroupComponent {
  public form: FormGroup;
  public field: NgxAbstractFormControl;

  constructor() {
    const config: INgxFormConfig = {
      controls: [
        {
          key: 'userDetails',
          type: NgxFormControlType.GROUP,
          level: 0,
          isDynamic: true,
          templateOptions: {
            displayOrder: 4
          },
          validators: [Validators.required],
          childrens: [
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
        }
      ]
    };

    const formConfig: NgxFormConfig = new NgxFormConfig(config);
    this.field = formConfig.controlsMap.userDetails;
    this.form = new FormGroup({
      userDetails: new FormGroup({
        firstName: new FormControl('')
      })
    });
  }
}

storiesOf('Shared|Forms/Components/FormControlGroupComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    moduleMetadata: {
      imports: [AppMockModules],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    },
    component: MockFormControlGroupComponent
  }));
