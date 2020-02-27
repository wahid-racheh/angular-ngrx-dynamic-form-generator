import { createAction, props } from '@ngrx/store';

import { FormControlsConfig } from '@app/shared/forms/classes/form-config.class';
import { PageTypeDef } from '@app/shared/forms/interfaces/types';

export const setData = createAction('[forms] SET_DATA', props<{ data: any }>());
export const setCurrentPage = createAction(
  '[forms] Set Current Page',
  props<{ currentPage: PageTypeDef }>()
);

export const updateData = createAction('[forms] UPDATE_DATA', props<{ data: any }>());

export const setFormConfig = createAction(
  '[forms] SET_FORM_CONFIG',
  props<{ formConfig: any }>()
);

export const setErrors = createAction('[forms] SET_ERRORS', props<{ errors: any }>());

export const initializeErrors = createAction('[forms] INITIALIZE_ERRORS');

export const initializeForm = createAction('[forms] INITIALIZE_FORM');

export const resetForm = createAction('[forms] RESET_FORM');
