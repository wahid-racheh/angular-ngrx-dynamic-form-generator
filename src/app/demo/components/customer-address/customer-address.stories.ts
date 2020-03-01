import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { storiesOf } from '@storybook/angular';

import { AppMockModules } from '@tests/mocks/app-mock-modules';
import { getMockedForm } from '@tests/mocks/forms-mock';

import { CustomerAddressComponent } from './customer-address.component';
import { NgxFormControlType } from '@app/shared/forms/interfaces/types';

const group: FormGroup = getMockedForm().get('customerDetails').get('address') as FormGroup;
const field = {
  key: 'address',
  type: NgxFormControlType.GROUP,
  componentRef: CustomerAddressComponent,
  templateOptions: {
    displayOrder: 8
  },
  childrens: [
    {
      key: 'street',
      type: NgxFormControlType.TEXT,
      templateOptions: {
        displayOrder: 1,
        label: 'Street',
        placeholder: 'Street'
      }
    },
    {
      key: 'suite',
      type: NgxFormControlType.TEXT,
      templateOptions: {
        displayOrder: 2,
        label: 'Apt. Number',
        placeholder: 'Apt. Number'
      }
    },
    {
      key: 'city',
      type: NgxFormControlType.TEXT,
      templateOptions: {
        displayOrder: 3,
        label: 'City',
        placeholder: 'City'
      }
    },
    {
      key: 'zipcode',
      type: NgxFormControlType.TEXT,
      templateOptions: {
        displayOrder: 0,
        label: 'Zipcode',
        placeholder: 'Zipcode'
      }
    },
  ]
};
storiesOf('Demo|Components/CustomerAddressComponent', module).add('default', () => ({
  component: CustomerAddressComponent,
  moduleMetadata: {
    imports: [AppMockModules],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  },
  props: {
    group,
    field
  }
}));
