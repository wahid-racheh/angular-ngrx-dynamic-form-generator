import { Action, createReducer, on } from '@ngrx/store';

import { FormGroup } from '@angular/forms';
import * as FormActions from '@app/shared/forms/+store/forms.actions';
import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';

export interface FormsState {
  data: any;
  formConfig: NgxFormConfig;
  form: FormGroup;
  valid: boolean;
  errors: any;
  touched: boolean;
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
