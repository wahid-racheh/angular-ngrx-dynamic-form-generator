import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';

import { NumberComponent } from '@app/shared/forms/components/number/number.component';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

storiesOf('Shared|Forms/Components/NumberComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    moduleMetadata: {
      imports: [AppMockModules],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    },
    component: NumberComponent,
    props: {
      label: 'Input label',
      group: new FormGroup({
        inputName: new FormControl('test')
      }),
      controlName: 'inputName',
      placeholder: 'Input placeholder',
      inputStyle: { width: '100%' },
      cssClassName: 'input-label',
      debounceTime: 300,
      onChange: action('onChange event was triggered'),
      onFocus: action('onFocus event was triggered'),
      onBlur: action('onBlur event was triggered')
    }
  }));
