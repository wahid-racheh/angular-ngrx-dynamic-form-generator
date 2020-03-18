import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';

import { AutoCompleteComponent } from '@app/shared/forms/components/auto-complete/auto-complete.component';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

const items = ['Option 1', 'Option 2'].map((i: string) => {
  return {
    key: i,
    value: i
  };
});

storiesOf('Shared|Forms/Components/AutoCompleteComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    moduleMetadata: {
      imports: [AppMockModules],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    },
    component: AutoCompleteComponent,
    props: {
      debounceTime: 300,
      minLength: 2,
      label: 'Auto Complete Label',
      group: new FormGroup({
        search: new FormControl()
      }),
      controlName: 'search',
      placeholder: 'Auto Complete placeholder',
      items,
      searchKey: 'value',
      asyncQuery: false,
      spinnerColor: 'green',
      spinnerSize: 20,
      showSpinner: false,
      onSelectItem: action('onSelectItem event was triggered'),
      onSearch: action('onSearch event was triggered'),
      onReset: action('onReset event was triggered')
    }
  }));
