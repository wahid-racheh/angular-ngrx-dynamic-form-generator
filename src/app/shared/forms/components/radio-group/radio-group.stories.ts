import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';

import { RadioGroupComponent } from '@app/shared/forms/components/radio-group/radio-group.component';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

const data: any[] = [
  { id: 'ENGINEER', name: 'Software Ingineer' },
  { id: 'DOCTOR', name: 'Doctor' }
];

const metadata: any = {
  moduleMetadata: {
    imports: [AppMockModules],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  },
  component: RadioGroupComponent,
  props: {
    label: 'Job',
    group: new FormGroup({
      job: new FormControl()
    }),
    controlName: 'job',
    placeholder: 'Job',
    data,
    optionKey: 'name',
    optionValue: 'id',
    onChange: action('onChange event was triggered')
  }
};

storiesOf('Shared|Forms/Components/RadioGroupComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    ...metadata
  }))
  .add('initial value', () => ({
    ...metadata,
    props: {
      ...metadata.props,
      selectedValue: data[1]
    }
  }))
  .add('column display', () => ({
    ...metadata,
    props: {
      ...metadata.props,
      displayInline: false,
      selectedValue: data[1]
    }
  }));
