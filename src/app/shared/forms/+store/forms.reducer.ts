import { Action, createReducer, on } from '@ngrx/store';

import { FormGroup } from '@angular/forms';
import * as FormActions from '@app/shared/forms/+store/forms.actions';
import { FormControlsConfig } from '@app/shared/forms/classes/form-config.class';
import { PageType, PageTypeDef } from '@app/shared/forms/interfaces/types';

export interface FormsState {
  data: any;
  formConfig: FormControlsConfig;
  form: FormGroup;
  valid: boolean;
  errors: any;
  touched: boolean;
  currentPage: PageTypeDef;
  reset: boolean;
}

export interface FormsStore {
  readonly state: FormsState;
}

export const formsInitialState: FormsState = {
  data: {},
  formConfig: null,
  form: null,
  valid: true,
  currentPage: PageType.CREATE_PAGE,
  errors: {},
  touched: false,
  reset: false
};

const reducer = createReducer(
  formsInitialState,
  on(FormActions.setData, (state, action) => ({
    ...state,
    data: action.data
  })),
  on(FormActions.setForm, (state, action) => ({
    ...state,
    form: action.form
  })),
  on(FormActions.updateData, (state, action) => {
    return {
      ...state,
      data: {},
      touched: true
    };
  }),
  on(FormActions.setCurrentPage, (state, action) => ({
    ...state,
    currentPage: action.currentPage
  })),
  on(FormActions.setFormConfig, (state, action) => {
    return {
      ...state,
      formConfig: action.formConfig
    };
  }),
  on(FormActions.setErrors, (state, action) => ({
    ...state,
    errors: action.errors
  })),
  on(FormActions.initializeErrors, (state, _) => ({
    ...state,
    errors: {}
  })),
  on(FormActions.initializeForm, (state, action) => ({
    ...formsInitialState
  })),
  on(FormActions.resetForm, (state, action) => ({
    ...state,
    touched: false,
    reset: !state.reset
  }))
);

export function formsReducer(state: FormsState | undefined, action: Action): FormsState {
  return reducer(state, action);
}

export const formsStoreName = 'formStore';
