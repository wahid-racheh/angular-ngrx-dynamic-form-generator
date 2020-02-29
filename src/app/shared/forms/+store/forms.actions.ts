import { createAction, props } from '@ngrx/store';

export const setData = createAction('[forms] SET_DATA', props<{ data: any }>());
export const setForm = createAction('[forms] SET_FORM', props<{ form: any }>());

export const updateData = createAction('[forms] UPDATE_DATA', props<{ data: any }>());

export const setFormConfig = createAction(
  '[forms] SET_FORM_CONFIG',
  props<{ formConfig: any }>()
);

export const setErrors = createAction('[forms] SET_ERRORS', props<{ errors: any }>());

export const initializeErrors = createAction('[forms] INITIALIZE_ERRORS');

export const initializeForm = createAction('[forms] INITIALIZE_FORM');

export const resetForm = createAction('[forms] RESET_FORM');
