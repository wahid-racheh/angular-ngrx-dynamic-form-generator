import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DemoEffects } from '@app/demo/+store/demo.effects';
import { DemoFacade } from '@app/demo/+store/demo.facade';
import { demoInitialState, demoReducer, demoStoreName } from '@app/demo/+store/demo.reducer';
import { ProductFormContainerComponent } from '@app/demo/components/product-form-container/product-form-container.component';
import { ProductListComponent } from '@app/demo/components/product-list/product-list.component';
import { SelectedProductViewerComponent } from '@app/demo/components/selected-product-viewer/selected-product-viewer.component';
import { DemoContainerComponent } from '@app/demo/containers/demo-container/demo-container.component';
import { DemoRoutingModule } from '@app/demo/demo-routing.module';
import { DemoResolverService } from '@app/demo/resolvers/demo-resolver.service';
import { SharedModule } from '@app/shared/shared.module';
import { CustomerAddressComponent } from './components/customer-address/customer-address.component';

const entryComponents: any[] = [CustomerAddressComponent];

@NgModule({
  declarations: [
    CustomerAddressComponent,
    DemoContainerComponent,
    ProductFormContainerComponent,
    SelectedProductViewerComponent,
    ProductListComponent
  ],
  imports: [
    SharedModule,
    DemoRoutingModule,

    // Store
    StoreModule.forFeature(demoStoreName, demoReducer, {
      initialState: demoInitialState
    }),
    EffectsModule.forFeature([DemoEffects])
  ],
  providers: [DemoResolverService, DemoFacade, DemoEffects],
  entryComponents: [...entryComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DemoModule {}
