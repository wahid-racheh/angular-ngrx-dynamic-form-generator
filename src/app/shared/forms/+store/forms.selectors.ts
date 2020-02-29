import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FormsState, formsStoreName } from '@app/shared/forms/+store/forms.reducer';

export const getState = createFeatureSelector<FormsState>(formsStoreName);
export const getFormConfig = createSelector(
  getState,
  (formsState: FormsState) => formsState.formConfig
);
export const getData = createSelector(getState, (formsState: FormsState) => formsState.data);
export const isValid = createSelector(getState, (formsState: FormsState) => formsState.valid);
export const getErrors = createSelector(getState, (formsState: FormsState) => formsState.errors);
export const getCurrentPage = createSelector(getState, (state: FormsState) => state.currentPage);
export const getForm = createSelector(getState, (state: FormsState) => state.form);
export const getTouchedForm = createSelector(
  getState,
  (formsState: FormsState) => formsState.touched
);
export const getResetFlag = createSelector(getState, (formsState: FormsState) => formsState.reset);

export const formQuery = {
  getState,
  getFormConfig,
  getData,
  getForm,
  isValid,
  getErrors,
  getTouchedForm,
  getResetFlag,
  getCurrentPage
};
