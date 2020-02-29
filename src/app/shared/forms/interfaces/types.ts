import { Type, TypeProvider } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';

export enum PageType {
  CREATE_PAGE = 'CREATE_PAGE',
  UPDATE_PAGE = 'UPDATE_PAGE',
  PREVIEW_PAGE = 'PREVIEW_PAGE'
}
export type PageTypeDef = PageType.CREATE_PAGE | PageType.UPDATE_PAGE | PageType.PREVIEW_PAGE;

export enum FieldType {
  ARRAY = 'ARRAY',
  GROUP = 'GROUP',

  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  ASYNC_AUTOCOMPLETE = 'ASYNC_AUTOCOMPLETE',
  CHECKBOX_GROUP = 'CHECKBOX_GROUP',
  RADIO = 'RADIO',
  NUMBER = 'NUMBER',
  DATE_PICKER = 'DATE_PICKER',
  SELECT = 'SELECT'
}

export type _FieldType =
  | FieldType.TEXT
  | FieldType.TEXTAREA
  | FieldType.AUTOCOMPLETE
  | FieldType.ASYNC_AUTOCOMPLETE
  | FieldType.CHECKBOX_GROUP
  | FieldType.RADIO
  | FieldType.NUMBER
  | FieldType.DATE_PICKER
  | FieldType.SELECT;

export interface TemplateOptions {
  displayOrder?: number;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  inputStyle?: any;
  cssClassName?: string;
  events?: {
    [key: string]: any;
  };
  attributes?: {
    [key: string]: any;
  };
  defaultValue?: any;
}

export interface AutoCompleteAsyncData {
  provider: TypeProvider;
  dataSelectorName: string;
  loadingSelectorName: string;
}

export interface ExtraOptions {
  // common properties
  data?: any;
  attributes?: any;
  preview?: boolean;

  // Date picker properties
  defaultValue?: moment.Moment;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;

  // AutoComplete properties
  searchKey?: string;
  debounceTime?: number;
  minLength?: number;
  spinnerSize?: number;
  spinnerColor?: string;
  asyncQuery?: boolean;
  showSpinner?: Observable<boolean> | boolean;
  asyncData?: AutoCompleteAsyncData;

  // Radio, Checkbox, select properties
  displayInline?: boolean;
  selectedValue?: any;
  selectedValues?: any[];
  optionKey?: string;
  optionValue?: string;
}

export interface BaseFormControl {
  key: string; // control name
  level?: number; // controls tree level
  isDynamic?: boolean; // using dynamic render if true, by default false
  className?: string; // control class name
  extraOptions?: ExtraOptions; // control extended options,
  validators?: any[]; // control validators

  // reference for an angular component
  // IMPORTANT!! Assigned component should be injected in entryComponent of the module
  componentRef?: Type<any>;
}

export interface FormFieldControl extends BaseFormControl {
  type: _FieldType; // control type
  templateOptions: TemplateOptions; // control template options
}

export interface FormGroupControl extends BaseFormControl {
  type: FieldType.GROUP; // control type
  templateOptions?: TemplateOptions; // control template options
  childrens: FormControlType[];
}

export interface FormArrayControl extends BaseFormControl {
  type: FieldType.ARRAY; // control type
  templateOptions: TemplateOptions; // control template options
  childrens: FormControlType[];
}

export type FormControlType = FormGroupControl | FormArrayControl | FormFieldControl;

export interface FormConfig {
  controls?: FormControlType[];
}
