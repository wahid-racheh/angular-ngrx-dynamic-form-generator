import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';

import { ArrayComponent } from '@app/shared/forms/components/array/array.component';
import { NgxFormControlType } from '@app/shared/forms/interfaces/types';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

storiesOf('Shared|Forms/Components/ArrayComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    moduleMetadata: {
      imports: [AppMockModules],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    },
    component: ArrayComponent,
    props: {
      group: new FormGroup({
        userDetails: new FormArray([
          new FormGroup({
            allergies: new FormControl('test'),
            lunchAttend: new FormControl('Oui')
          })
        ])
      }),
      field: {
        key: 'userDetails',
        type: NgxFormControlType.ARRAY,
        isDynamic: true,
        templateOptions: {
          displayOrder: 0
        },
        childrens: [
          {
            key: 'lunchAttend',
            type: NgxFormControlType.RADIO,
            isDynamic: true,
            templateOptions: {
              displayOrder: 1,
              label: 'Participera au déjeuner'
            },
            extraOptions: {
              data: [
                { name: 'Oui', value: 'Oui' },
                { name: 'Non', value: 'Non' }
              ],
              selectedValue: [{ name: 'Oui', value: 'Oui' }],
              optionKey: 'name',
              optionValue: 'value'
            }
          },
          {
            key: 'allergies',
            type: NgxFormControlType.TEXTAREA,
            isDynamic: true,
            templateOptions: {
              displayOrder: 2,
              label: 'Allergies a signaler ?'
            }
          }
        ]
      }
    }
  }));
