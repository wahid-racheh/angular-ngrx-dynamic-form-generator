import { Type, TypeProvider } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';

export enum NgxFormControlType {
  ARRAY = 'ARRAY',
  GROUP = 'GROUP',
  CUSTOM_TEMPLATE = 'CUSTOM_TEMPLATE',

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

export type _NgxFormControlType =
  | NgxFormControlType.TEXT
  | NgxFormControlType.TEXTAREA
  | NgxFormControlType.AUTOCOMPLETE
  | NgxFormControlType.ASYNC_AUTOCOMPLETE
  | NgxFormControlType.CHECKBOX_GROUP
  | NgxFormControlType.RADIO
  | NgxFormControlType.NUMBER
  | NgxFormControlType.DATE_PICKER
  | NgxFormControlType.SELECT;

export interface NgxTemplateOptions {
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

export interface NgxAutoCompleteAsyncData {
  provider: TypeProvider;
  dataSelectorName: string;
  loadingSelectorName: string;
}

export interface NgxExtraOptions {
  // common properties
  data?: any;
  attributes?: any;

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
  asyncData?: NgxAutoCompleteAsyncData;

  // Radio, Checkbox, select properties
  displayInline?: boolean;
  selectedValue?: any;
  selectedValues?: any[];
  optionKey?: string;
  optionValue?: string;
}

export interface NgxBaseFormControl {
  key: string; // control name
  level?: number; // controls tree level
  isDynamic?: boolean; // using dynamic render if true, by default false
  className?: string; // control class name
  extraOptions?: NgxExtraOptions; // control extended options,
  validators?: any[]; // control validators
}

export interface NgxAbstractCustomFormControl extends NgxBaseFormControl {
  type: NgxFormControlType.CUSTOM_TEMPLATE; // control type
  templateOptions: NgxTemplateOptions; // control template options
}

export interface NgxCustomFormComponent extends NgxAbstractCustomFormControl {
  // reference for an angular component
  // IMPORTANT!! component should be injected in entryComponent array of the module
  componentRef: Type<any>;
}

export interface NgxCustomFormTemplate extends NgxAbstractCustomFormControl {
  htmlTemplate: string;
}


export interface NgxFormControl extends NgxBaseFormControl {
  type: _NgxFormControlType; // control type
  templateOptions: NgxTemplateOptions; // control template options

  // reference for an angular component
  // IMPORTANT!! component should be injected in entryComponent array of the module
  componentRef?: Type<any>;
}

export interface NgxFormGroup extends NgxBaseFormControl {
  type: NgxFormControlType.GROUP; // control type
  templateOptions?: NgxTemplateOptions; // control template options
  childrens: NgxAbstractFormControl[];

  // reference for an angular component
  // IMPORTANT!! component should be injected in entryComponent array of the module
  componentRef?: Type<any>;
}

export interface NgxFormArray extends NgxBaseFormControl {
  type: NgxFormControlType.ARRAY; // control type
  templateOptions: NgxTemplateOptions; // control template options
  childrens: NgxAbstractFormControl[];

  // reference for an angular component
  // IMPORTANT!! component should be injected in entryComponent array of the module
  componentRef?: Type<any>;
}

export type NgxAbstractFormControl = 
  NgxFormGroup | 
  NgxFormArray |
  NgxFormControl |
  NgxCustomFormComponent |
  NgxCustomFormTemplate;
