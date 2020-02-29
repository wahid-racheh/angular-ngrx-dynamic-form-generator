import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FieldType, FormControlType } from '@app/shared/forms/interfaces/types';

// Validate all form controls
export const validateAllFormFields = (fg): void => {
  Object.keys(fg.controls).forEach((field: any) => {
    const c = fg.get(field);
    if (c instanceof FormControl) {
      c.markAsTouched({ onlySelf: true });
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

export const isCheckboxGroupControl = (control: FormControlType): boolean => {
  return control.type === FieldType.CHECKBOX_GROUP;
};

export const isGroupControl = (control: FormControlType): boolean => {
  return control.type === FieldType.GROUP;
};

export const isArrayControl = (control: FormControlType): boolean => {
  return control.type === FieldType.ARRAY;
};

export const isFieldControl = (control: FormControlType): boolean => {
  return !isGroupControl(control) && !isArrayControl(control);
};

// Build Form in recursive mode, return a FromGroup
export const buildForm = (controls: FormControlType[]): FormGroup => {
  return createGroup(controls, new FormGroup({}));
};

// Return a FormGroup with nested groups, arrays and fields
export const createGroup = (controls: FormControlType[], group: FormGroup): FormGroup => {
  controls.forEach((control: any) => {
    if (isArrayControl(control) || isCheckboxGroupControl(control)) {
      group.addControl(control.key, createArray(control.childrens, new FormArray([])));
    } else if (isGroupControl(control)) {
      group.addControl(control.key, createGroup(control.childrens, new FormGroup({})));
    } else {
      group.addControl(control.key, createField(control));
    } 
    // TODO add aray and group validations
    // if (control.validators && !!control.validators.length) {
    //   group.setValidators(control.validators);
    // }
  });
  return group;
};

// Return a FormArray with nested groups and fields
export const createArray = (controls: FormControlType[], array: FormArray): FormArray => {
  if (controls && !!controls.length) {
    // Add index control to identify group index in the array
    const group = createGroup(
      controls,
      new FormGroup({
        index: new FormControl(0)
      })
    );
    array.push(group);
  }
  return array;
};

// Return a FormControl
export const createField = (control: FormControlType): FormControl => {
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
    const group: FormGroup = new FormGroup({
      index: indexControl
    });
    formArray.push(createGroup(field.childrens, group));
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
export const addFormControl = (group: FormGroup, field: FormControlType): void => {
  group.addControl(field.key, createField(field));
};

// Remove form control, usage :
// From a FormGroup : removeFormControl(form.get('groupName') as FormGroup, 'controlName');
// From a FormArray : removeFormControl(form.get('ArrayName').at(groupIndex) as FormGroup, 'controlName');
export const removeFormControl = (group: FormGroup, field: FormControlType): void => {
  group.removeControl(field.key);
};
