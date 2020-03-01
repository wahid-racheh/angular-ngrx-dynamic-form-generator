import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as FormsActions from '@app/shared/forms/+store/forms.actions';
import { FormsFacade } from '@app/shared/forms/+store/forms.facade';
import { FormsStore } from '@app/shared/forms/+store/forms.reducer';
import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';

describe('FormsFacade', () => {
  let store: MockStore<FormsStore>;
  let facade: FormsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormsFacade, provideMockStore()]
    });
    // @ts-ignore
    store = TestBed.inject(Store);
    facade = TestBed.inject(FormsFacade);
    spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch a FormsActions.setFormConfig action when setFormConfig is called', () => {
    // GIVEN
    const formConfig: NgxFormConfig = null;
    const action = FormsActions.setFormConfig({ formConfig });
    // WHEN
    facade.setFormConfig(formConfig);
    // THEN
    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a FormsActions.setData action when setData is called', () => {
    // GIVEN
    const data = { test: 'test' };
    const action = FormsActions.setData({ data });
    // WHEN
    facade.setData(data);
    // THEN
    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a FormsActions.updateData action when updateData is called', () => {
    // GIVEN
    const data = { test: 'test' };
    const action = FormsActions.updateData({ data });
    // WHEN
    facade.updateData(data);
    // THEN
    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a FormsActions.initializeForm action when initializeForm is called', () => {
    // GIVEN
    const action = FormsActions.initializeForm();
    // WHEN
    facade.initializeForm();
    // THEN
    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a FormsActions.initializeErrors action when initializeErrors is called', () => {
    // GIVEN
    const action = FormsActions.initializeErrors();
    // WHEN
    facade.initializeErrors();
    // THEN
    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a FormsActions.resetForm action when resetForm is called', () => {
    // GIVEN
    const action = FormsActions.resetForm();
    // WHEN
    facade.resetForm();
    // THEN
    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
