import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { NgxFormControlType, NgxAbstractFormControl } from '@app/shared/forms/interfaces/types';

// Validate all form controls
export const validateAllFormFields = (fg): void => {
  Object.keys(fg.controls).forEach((field: any) => {
    const c = fg.get(field);
    if (c instanceof FormControl) {
      c.markAsTouched({ onlySelf: true });
      c.updateValueAndValidity();
    } else if (c instanceof FormGroup || c instanceof FormArray) {
      validateAllFormFields(c);
    }
  });
};

// Escape spaces from all form control values
export const normalizeFormControlValues = (fg): void => {
  Object.keys(fg.controls).forEach((field: any) => {
    const c = fg.get(field);
    if (c instanceof FormControl) {
      if (typeof c.value === 'string') {
        c.patchValue(c.value.toString().replace(/\s/g, ''), { emitEvent: false });
      }
    } else if (c instanceof FormGroup || c instanceof FormArray) {
      normalizeFormControlValues(c);
    }
  });
};

export const handleInputValueChangesEvent = (
  valueChanges: any,
  debounce: number,
  unsubscribe: Observable<any>
): Observable<any> => {
  return valueChanges.pipe(debounceTime(debounce), distinctUntilChanged(), takeUntil(unsubscribe));
};

export const isCustomTemplate = (control: NgxAbstractFormControl): boolean => {
  return control.type === NgxFormControlType.CUSTOM_TEMPLATE;
};

export const isCheckboxGroupControl = (control: NgxAbstractFormControl): boolean => {
  return control.type === NgxFormControlType.CHECKBOX_GROUP;
};

export const isGroupControl = (control: NgxAbstractFormControl): boolean => {
  return control.type === NgxFormControlType.GROUP;
};

export const isArrayControl = (control: NgxAbstractFormControl): boolean => {
  return control.type === NgxFormControlType.ARRAY;
};

export const isFieldControl = (control: NgxAbstractFormControl): boolean => {
  return !isGroupControl(control) && !isArrayControl(control);
};

// Build Form in recursive mode, return a FromGroup
export const buildForm = (controls: NgxAbstractFormControl[]): FormGroup => {
  return createGroup(controls, new FormGroup({}));
};

// Return a FormGroup with nested groups, arrays and fields
export const createGroup = (controls: NgxAbstractFormControl[], group: FormGroup): FormGroup => {
  controls.forEach((control: any) => {
    if (!isCustomTemplate(control)) {
      if (isArrayControl(control) || isCheckboxGroupControl(control)) {
        group.addControl(control.key, createArray(control, new FormArray([])));
      } else if (isGroupControl(control)) {
        group.addControl(control.key, createGroup(control.childrens, new FormGroup({})));
        if (control.validators && !!control.validators.length) {
          group.setValidators(control.validators);
        }
      } else {
        group.addControl(control.key, createField(control));
      }
    }    
  });
  return group;
};

// Return a FormArray with nested groups and fields
export const createArray = (control: NgxAbstractFormControl, array: FormArray): FormArray => {
  if (control.hasOwnProperty('childrens') && !!control['childrens'].length) {
    // Add index control to identify group index in the array
    const group = createGroup(
      control['childrens'],
      new FormGroup({
        index: new FormControl(0)
      })
    );
    if (control.validators && !!control.validators.length) {
      group.setValidators(control.validators);
    }
    array.push(group);
  }
  return array;
};

// Return a FormControl
export const createField = (control: NgxAbstractFormControl): FormControl => {
  const defaultValue = control.templateOptions.hasOwnProperty('defaultValue') ?
      control.templateOptions.defaultValue : null;
  if (control.validators) {
    return new FormControl(defaultValue, control.validators);
  }
  return new FormControl(defaultValue);
};

export const getCheckboxStaticGroup = (p1, p2, p3) => {
  return new FormGroup({
    name: new FormControl(p1),
    value: new FormControl(p2),
    selected: new FormControl(p3)
  });
};

// Add FormArray : addFormArray(form.get('ArrayName') as FormArray, field);
export const addFormArray = (formArray: FormArray, field: any): void => {
  if (field.childrens) {
    // Add index input to identify group index in the array
    const indexControl = new FormControl(formArray.value.length);
    const group: FormGroup = createGroup(field.childrens, new FormGroup({
      index: indexControl
    }));
    if (field.validators && !!field.validators.length) {
      group.setValidators(field.validators);
    }
    formArray.push(group);
    if (formArray.parent) {
      formArray.parent.markAsDirty();
    } else {
      formArray.markAsDirty();
    }
  }
};

// Remove FormArray : removeFormArrayAt(form.get('ArrayName') as FormArray, item.index);
export const removeFormArrayAt = (formArray: FormArray, index: number): void => {
  formArray.removeAt(index);
  if (formArray.parent) {
    formArray.parent.markAsDirty();
  } else {
    formArray.markAsDirty();
  }
};

// Add form control, usage :
// From a FormGroup : addFormControl(form.get('groupName') as FormGroup, 'controlName');
// From a FormArray : addFormControl(form.get('ArrayName').at(groupIndex) as FormGroup, 'controlName');
export const addFormControl = (group: FormGroup, field: NgxAbstractFormControl): void => {
  group.addControl(field.key, createField(field));
};

// Remove form control, usage :
// From a FormGroup : removeFormControl(form.get('groupName') as FormGroup, 'controlName');
// From a FormArray : removeFormControl(form.get('ArrayName').at(groupIndex) as FormGroup, 'controlName');
export const removeFormControl = (group: FormGroup, field: NgxAbstractFormControl): void => {
  group.removeControl(field.key);
};
