import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { storiesOf } from '@storybook/angular';

import { ProductFormContainerComponent } from '@app/demo/components/product-form-container/product-form-container.component';
import { ProductListComponent } from '@app/demo/components/product-list/product-list.component';
import { SelectedProductViewerComponent } from '@app/demo/components/selected-product-viewer/selected-product-viewer.component';
import { DemoContainerComponent } from '@app/demo/containers/demo-container/demo-container.component';
import { CustomerAddressComponent } from '@app/demo/components/customer-address/customer-address.component';

import { AppMockModules } from '@tests/mocks/app-mock-modules';
import { CustomTextComponent } from '@app/demo/components/custom-text/custom-text.component';

storiesOf('Demo|Containers/DemoContainer', module).add('default', () => ({
  component: DemoContainerComponent,
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
