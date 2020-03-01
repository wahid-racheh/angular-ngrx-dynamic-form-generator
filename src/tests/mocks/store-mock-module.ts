import { NgModule } from '@angular/core';
import { errorReducer, errorStoreName } from '@app/core/interceptors/error/+store/error.reducer';
import { i18nReducer, i18nStoreName } from '@app/core/services/i18n/+store/i18n.reducer';
import { userReducer, userStoreName } from '@app/core/services/user/+store/user.reducer';
import { DemoFacade } from '@app/demo/+store/demo.facade';
import { demoReducer, demoStoreName } from '@app/demo/+store/demo.reducer';
import { formsReducer, formsStoreName } from '@app/shared/forms/+store/forms.reducer';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';

export interface State {
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};

export function mockReducer(actionReducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any): any => {
    return actionReducer(state, action);
  };
}

export const metaReducers: Array<MetaReducer<any>> = !environment.production ? [mockReducer] : [];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature(i18nStoreName, i18nReducer),
    StoreModule.forFeature(demoStoreName, demoReducer),
    StoreModule.forFeature(errorStoreName, errorReducer),
    StoreModule.forFeature(userStoreName, userReducer),
    StoreModule.forFeature(formsStoreName, formsReducer),
    EffectsModule.forRoot([])
  ],
  providers: [DemoFacade],
  exports: [StoreModule, EffectsModule]
})
export class StoreMockModule {}
