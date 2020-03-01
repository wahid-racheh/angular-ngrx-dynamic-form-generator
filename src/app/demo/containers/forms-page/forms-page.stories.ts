import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { storiesOf } from '@storybook/angular';

import { ProductFormContainerComponent } from '@app/demo/components/product-form-container/product-form-container.component';
import { ProductListComponent } from '@app/demo/components/product-list/product-list.component';
import { SelectedProductViewerComponent } from '@app/demo/components/selected-product-viewer/selected-product-viewer.component';
import { CustomerAddressComponent } from '@app/demo/components/customer-address/customer-address.component';
import { FormsPageComponent } from './forms-page.component';

import { AppMockModules } from '@tests/mocks/app-mock-modules';
import { CustomTextComponent } from '@app/demo/components/custom-text/custom-text.component';

storiesOf('Demo|Containers/FormsPageComponent', module).add('default', () => ({
  component: FormsPageComponent,
  moduleMetadata: {
    imports: [AppMockModules],
    declarations: [
      CustomTextComponent,
      ProductFormContainerComponent,
      SelectedProductViewerComponent,
      CustomerAddressComponent,
      ProductListComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [SelectedProductViewerComponent, CustomerAddressComponent, CustomTextComponent]
  }
}));
