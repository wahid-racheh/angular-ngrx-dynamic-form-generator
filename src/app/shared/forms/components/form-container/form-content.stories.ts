import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';
import { Observable, of } from 'rxjs';

import { FormControlsConfig } from '@app/shared/forms/classes/form-config.class';
import { FieldType, FormConfig } from '@app/shared/forms/interfaces/types';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-mock-form-content',
  template: `
    <app-form-content [formConfig$]="formConfig$">
      <app-text-input
        class="d-flex w-100"
        [group]="mockForm"
        controlName="firstName"
        label="First Name"
      ></app-text-input>
    </app-form-content>
  `
})
export class MockFormContentComponent {
  public formConfig$: Observable<FormControlsConfig>;
  public mockForm: FormGroup;

  constructor() {
    const config: FormConfig = {
      controls: [
        {
          key: 'firstName',
          type: FieldType.TEXT,
          level: 1,
          templateOptions: {
            displayOrder: 0,
            label: 'firstName',
            placeholder: 'firstName'
          },
          validators: [Validators.required]
        }
      ]
    };

    this.formConfig$ = of(new FormControlsConfig(config));
    this.mockForm = new FormGroup({
      firstName: new FormControl('')
    });
  }
}

storiesOf('Shared|Forms/Components/FormContentComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    moduleMetadata: {
      imports: [AppMockModules],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    },
    component: MockFormContentComponent,
    props: {}
  }));
