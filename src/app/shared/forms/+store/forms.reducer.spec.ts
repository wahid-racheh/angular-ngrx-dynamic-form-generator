import * as FormsActions from '@app/shared/forms/+store/forms.actions';
import { formsInitialState, formsReducer } from '@app/shared/forms/+store/forms.reducer';
import { PageType } from '@app/shared/forms/interfaces/types';

describe('FormReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      // GIVEN
      // WHEN
      const result = formsReducer(undefined, {} as any);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('SET_DATA', () => {
    it('should set data in the state', () => {
      // GIVEN
      const action = FormsActions.setData({ data: null });
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('UPDTAE_DATA', () => {
    it('should update data in the state', () => {
      // GIVEN
      const action = FormsActions.updateData({ data: null });
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('SET_FORM_CONFIG', () => {
    it('should set formConfig in the state', () => {
      // GIVEN
      const action = FormsActions.setFormConfig({ formConfig: null });
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('SET_ERRORS', () => {
    it('should set errors in the state', () => {
      // GIVEN
      const action = FormsActions.setErrors({ errors: null });
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('INITIALIZE_ERRORS', () => {
    it('should initialize errors', () => {
      // GIVEN
      const action = FormsActions.initializeErrors();
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('INITIALIZE_FORM', () => {
    it('should initialize form', () => {
      // GIVEN
      const action = FormsActions.initializeForm();
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('RESET_FORM', () => {
    it('should set touched, reset in the state', () => {
      // GIVEN
      const action = FormsActions.resetForm();
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });

  describe('SET_ACTION', () => {
    it('should set currentPage in the state', () => {
      // GIVEN
      const action = FormsActions.setCurrentPage({ currentPage: PageType.CREATE_PAGE });
      // WHEN
      const result = formsReducer(formsInitialState, action);
      // THEN
      expect(result).toMatchSnapshot();
    });
  });
});
