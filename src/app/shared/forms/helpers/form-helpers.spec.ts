import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  addFormArray,
  addFormControl,
  buildForm,
  createArray,
  createField,
  createGroup,
  getCheckboxStaticGroup,
  handleInputValueChangesEvent,
  isArrayControl,
  isFieldControl,
  isGroupControl,
  normalizeFormControlValues,
  removeFormArrayAt,
  removeFormControl,
  validateAllFormFields
} from '@app/shared/forms/helpers/form-helpers';
import { NgxFormControlType } from '@app/shared/forms/interfaces/types';

// tslint:disable-next-line:no-big-function
describe('Form helpers', () => {
  describe('`validateAllFormFields`', () => {
    it('should calculate if the form is valid', () => {
      // GIVEN
      const form: FormGroup = new FormGroup({
        testControl: new FormControl(null, Validators.required),
        testControl1: new FormGroup({
          testControl2: new FormControl(null, Validators.required)
        }),
        testControl3: new FormArray([
          new FormGroup({
            testControl4: new FormControl(null, Validators.required)
          })
        ])
      });
      // WHEN
      validateAllFormFields(form);
      // THEN
      expect(form.valid).toBe(false);

      // GIVEN
      // WHEN
      form.get('testControl').setValue('test');
      form
        .get('testControl1')
        .get('testControl2')
        .setValue('test');
      const formArray: FormArray = form.get('testControl3') as FormArray;
      formArray.controls.forEach((g: FormGroup) => {
        g.get('testControl4').setValue('test');
      });
      // THEN
      expect(form.valid).toBe(true);
    });
  });

  describe('`normalizeFormControlValues`', () => {
    it('should remove spaces from controls values', () => {
      // GIVEN
      const form: FormGroup = new FormGroup({
        testControl1: new FormControl('   value '),
        nestedGroup: new FormGroup({
          testControl2: new FormControl('value   ')
        })
      });
      // WHEN
      normalizeFormControlValues(form);
      // THEN
      expect(form.get('testControl1').value).toBe('value');
      expect(form.get('nestedGroup').get('testControl2').value).toBe('value');
    });
  });

  describe('`handleInputValueChangesEvent`', () => {
    it('should return a promise', () => {
      // GIVEN
      const formControl: FormControl = new FormControl();
      const event: Observable<any> = handleInputValueChangesEvent(
        formControl.valueChanges,
        0,
        new Observable<any>()
      );
      // WHEN
      formControl.setValue('test control');
      // THEN
      event.subscribe((changes: any) => {
        expect(changes).toBeObservable();
      });
    });
  });

  describe('`isGroupControl`', () => {
    it('should return true if form control is a group', () => {
      // GIVEN
      const control: any = { type: NgxFormControlType.GROUP };
      // WHEN
      const result: boolean = isGroupControl(control);
      // THEN
      expect(result).toBeTruthy();
    });

    it('should return false if form control is not a group', () => {
      // GIVEN
      const control: any = { type: NgxFormControlType.TEXT };
      // WHEN
      const result: boolean = isGroupControl(control);
      // THEN
      expect(result).toBeFalsy();
    });
  });

  describe('`isArrayControl`', () => {
    it('should return true if form control is an array', () => {
      // GIVEN
      const control: any = { type: NgxFormControlType.ARRAY };
      // WHEN
      const result: boolean = isArrayControl(control);
      // THEN
      expect(result).toBeTruthy();
    });

    it('should return false if form control is not an array', () => {
      // GIVEN
      const control: any = { type: NgxFormControlType.TEXT };
      // WHEN
      const result: boolean = isArrayControl(control);
      // THEN
      expect(result).toBeFalsy();
    });
  });

  describe('`isFieldControl`', () => {
    it('should return true if form control is a field', () => {
      // GIVEN
      const control: any = { type: NgxFormControlType.TEXT };
      // WHEN
      const result: boolean = isFieldControl(control);
      // THEN
      expect(result).toBeTruthy();
    });

    it('should return false if form control is not a field', () => {
      // GIVEN
      const control: any = { type: NgxFormControlType.GROUP };
      // WHEN
      const result: boolean = isFieldControl(control);
      // THEN
      expect(result).toBeFalsy();
    });
  });

  describe('`buildForm`', () => {
    it('should return a FormGroup', () => {
      // GIVEN
      const controls: any = [
        {
          key: 'userDetails',
          type: NgxFormControlType.GROUP,
          isDynamic: true,
          childrens: [
            {
              key: 'lunchAttend',
              type: NgxFormControlType.RADIO_GROUP,
              isDynamic: true,
              templateOptions: {
                displayOrder: 1,
                label: 'Participera au déjeuner'
              }
            }
          ]
        }
      ];
      // WHEN
      const form: FormGroup = buildForm(controls);
      // THEN
      expect(form).toBeDefined();
      expect(form.get('userDetails')).toBeDefined();
    });
  });

  describe('`createGroup`', () => {
    it('should return a FormGroup', () => {
      // GIVEN
      const controls: any = [
        {
          key: 'userDetails',
          type: NgxFormControlType.GROUP,
          isDynamic: true,
          childrens: [
            {
              key: 'lunchAttend',
              type: NgxFormControlType.RADIO_GROUP,
              isDynamic: true,
              templateOptions: {
                displayOrder: 1,
                label: 'Participera au déjeuner'
              }
            }
          ]
        }
      ];
      // WHEN
      const group: FormGroup = createGroup(controls, new FormGroup({}));
      // THEN
      expect(group).toBeDefined();
      expect(group instanceof FormGroup).toBeTruthy();
    });
  });

  describe('`createArray`', () => {
    it('should return a FormArray', () => {
      // GIVEN
      const controls: any = [
        {
          key: 'userDetails',
          type: NgxFormControlType.ARRAY,
          isDynamic: true,
          childrens: [
            {
              key: 'lunchAttend',
              type: NgxFormControlType.RADIO_GROUP,
              isDynamic: true,
              templateOptions: {
                displayOrder: 1,
                label: 'Participera au déjeuner'
              }
            }
          ]
        }
      ];
      // WHEN
      const array: FormArray = createArray(controls, new FormArray([]));
      // THEN
      expect(array).toBeDefined();
      expect(array instanceof FormArray).toBeTruthy();
    });
  });

  describe('`createField`', () => {
    it('should return a FormControl', () => {
      // GIVEN
      const field: any = {
        key: 'lunchAttend',
        type: NgxFormControlType.TEXTAREA,
        isDynamic: true,
        templateOptions: {
          displayOrder: 1,
          label: 'Participera au déjeuner'
        }
      };

      // WHEN
      const control: FormControl = createField(field);
      // THEN
      expect(control).toBeDefined();
      expect(control instanceof FormControl).toBeTruthy();
    });
  });

  describe('`getCheckboxStaticGroup`', () => {
    it('should return a static checkbox group', () => {
      // GIVEN
      const name = 'name';
      const value = 'value';
      const selected = false;

      // WHEN
      const group: FormGroup = getCheckboxStaticGroup(name, value, selected);
      // THEN
      expect(group).toBeDefined();
      expect(group instanceof FormGroup).toBeTruthy();
      expect(group.get('selected').value).toBeFalsy();
    });
  });

  describe('`addFormArray`', () => {
    it('should add control in a FormArray', () => {
      // GIVEN
      const controls: any = [
        {
          key: 'userDetails',
          type: NgxFormControlType.ARRAY,
          isDynamic: true,
          childrens: [
            {
              key: 'lunchAttend',
              type: NgxFormControlType.RADIO_GROUP,
              isDynamic: true,
              templateOptions: {
                displayOrder: 1,
                label: 'Participera au déjeuner'
              }
            }
          ]
        }
      ];
      const array: FormArray = new FormArray([]);
      // WHEN
      // THEN
      expect(array.value.length).toEqual(0);

      // WHEN
      addFormArray(array, controls[0]);
      // THEN
      expect(array.value.length).toEqual(1);
    });
  });

  describe('`removeFormArrayAt`', () => {
    it('should remove control from a FormArray', () => {
      // GIVEN
      const controls: any = [
        {
          key: 'userDetails',
          type: NgxFormControlType.ARRAY,
          isDynamic: true,
          childrens: [
            {
              key: 'lunchAttend',
              type: NgxFormControlType.RADIO_GROUP,
              isDynamic: true,
              templateOptions: {
                displayOrder: 1,
                label: 'Participera au déjeuner'
              }
            }
          ]
        }
      ];
      const array: FormArray = new FormArray([]);
      // WHEN
      addFormArray(array, controls[0]);
      // THEN
      expect(array.value.length).toEqual(1);

      // WHEN
      removeFormArrayAt(array, 0);
      // THEN
      expect(array.value.length).toEqual(0);
    });
  });

  describe('`addFormControl`', () => {
    it('should add control in a FormGroup', () => {
      // GIVEN
      const control: any = {
        key: 'lunchAttend',
        type: NgxFormControlType.RADIO_GROUP,
        isDynamic: true,
        templateOptions: {
          displayOrder: 1,
          label: 'Participera au déjeuner'
        }
      };
      const group: FormGroup = new FormGroup({});
      // WHEN
      // THEN
      expect(Object.keys(group.value).length).toEqual(0);

      // WHEN
      addFormControl(group, control);
      // THEN
      expect(Object.keys(group.value).length).toEqual(1);
    });
  });

  describe('`removeFormControl`', () => {
    it('should remove control from a FormGroup', () => {
      // GIVEN
      const control: any = {
        key: 'lunchAttend',
        type: NgxFormControlType.RADIO_GROUP,
        isDynamic: true,
        templateOptions: {
          displayOrder: 1,
          label: 'Participera au déjeuner'
        }
      };
      const group: FormGroup = new FormGroup({});
      // WHEN
      addFormControl(group, control);
      // THEN
      expect(Object.keys(group.value).length).toEqual(1);

      // WHEN
      removeFormControl(group, control);
      // THEN
      expect(Object.keys(group.value).length).toEqual(0);
    });
  });
});
