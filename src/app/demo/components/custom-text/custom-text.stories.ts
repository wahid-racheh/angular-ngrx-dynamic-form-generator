import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { storiesOf } from '@storybook/angular';

import { AppMockModules } from '@tests/mocks/app-mock-modules';
import { getMockedForm } from '@tests/mocks/forms-mock';
import { CustomTextComponent } from './custom-text.component';

import { NgxFormControlType } from '@app/shared/forms/interfaces/types';

const group: FormGroup = getMockedForm().get('customerDetails') as FormGroup;
const field = {
  key: 'firstName',
  type: NgxFormControlType.TEXT,
  templateOptions: {
    displayOrder: 3,
    label: 'firstName',
    placeholder: 'firstName'
  }
};
storiesOf('Demo|Components/CustomTextComponent', module).add('default', () => ({
  component: CustomTextComponent,
  moduleMetadata: {
    imports: [AppMockModules],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  },
  props: {
    group,
    field
  }
}));
