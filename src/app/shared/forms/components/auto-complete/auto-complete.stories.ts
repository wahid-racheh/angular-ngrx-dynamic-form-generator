import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { storiesOf } from '@storybook/angular';

import { DEMO_TEST_ITEMS } from '@app/client/demo/constants/test-items';
import { AutoCompleteComponent } from '@app/shared/forms/components/auto-complete/auto-complete.component';

import { AppMockModules } from '@tests/mocks/app-mock-modules';

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
      items: DEMO_TEST_ITEMS,
      searchKey: 'name',
      asyncQuery: false,
      spinnerColor: 'green',
      spinnerSize: 20,
      showSpinner: false
    }
  }));
