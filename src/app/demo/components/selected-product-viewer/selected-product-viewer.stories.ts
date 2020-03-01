import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { storiesOf } from '@storybook/angular';

import { SelectedProductViewerComponent } from '@app/demo/components/selected-product-viewer/selected-product-viewer.component';

import { AppMockModules } from '@tests/mocks/app-mock-modules';
import { getMockedForm } from '@tests/mocks/forms-mock';
import { NgxFormControlType } from '@app/shared/forms/interfaces/types';
import { ProductTypesEnum } from '@app/demo/interfaces/product-form.interface';

const group: FormGroup = getMockedForm(3, true);
const field = {
    key: 'productViewer',
    type: NgxFormControlType.CUSTOM_TEMPLATE,
    componentRef: SelectedProductViewerComponent,
    templateOptions: {
      displayOrder: 1,
      events: {
        onAddProduct: new EventEmitter()
      }
    },
    extraOptions: {
      data: [...Object.values(ProductTypesEnum)].map((i: string, index: number) => {
        return {
          key: i,
          value: i
        }
      })
    }
  };

storiesOf('Demo|Components/SelectedProductViewerComponent', module).add('default', () => ({
  component: SelectedProductViewerComponent,
  moduleMetadata: {
    imports: [AppMockModules],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  },
  props: {
    group,
    field
  }
}));
