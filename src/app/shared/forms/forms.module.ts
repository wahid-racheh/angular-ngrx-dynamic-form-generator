import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/shared/components/material/material.module';
import { DirectivesModule } from '@app/shared/directives/directives.module';
import { FormsEffects } from '@app/shared/forms/+store/forms.effects';
import {
  formsInitialState,
  formsReducer,
  formsStoreName
} from '@app/shared/forms/+store/forms.reducer';
import { ArrayComponent } from '@app/shared/forms/components/array/array.component';
import {
  AutoCompleteAsyncWrapperComponent,
  AutoCompleteComponent,
  AutoCompleteWrapperComponent
} from '@app/shared/forms/components/auto-complete/auto-complete.component';
import {
  CheckboxGroupComponent,
  CheckboxGroupWrapperComponent
} from '@app/shared/forms/components/checkbox-group/checkbox-group.component';
import { ErrorMessageComponent } from '@app/shared/forms/components/control-message/error-message.component';
import {
  DatePickerComponent,
  DatePickerWrapperComponent
} from '@app/shared/forms/components/date-picker/date-picker.component';
import {
  FormComponent,
  FormContentComponent
} from '@app/shared/forms/components/form-container/form-content.component';
import { FormControlFieldComponent } from '@app/shared/forms/components/form-control-field/form-control-field.component';
import { FormControlGroupComponent } from '@app/shared/forms/components/form-control-group/form-control-group.component';
import {
  NumberComponent,
  NumberWrapperComponent
} from '@app/shared/forms/components/number/number.component';
import {
  RadioGroupComponent,
  RadioGroupWrapperComponent
} from '@app/shared/forms/components/radio-group/radio-group.component';
import {
  SelectComponent,
  SelectWrapperComponent
} from '@app/shared/forms/components/select/select.component';
import { SizePickerComponent } from '@app/shared/forms/components/size-picker/size-picker.component';
import {
  TextAreaComponent,
  TextAreaWrapperComponent
} from '@app/shared/forms/components/text-area/text-area.component';
import {
  TextInputComponent,
  TextInputWrapperComponent
} from '@app/shared/forms/components/text-input/text-input.component';
import { AutocompleteDirective } from '@app/shared/forms/directives/autocomplete/autocomplete.directive';
import { DynamicFieldDirective } from '@app/shared/forms/directives/dynamic-field/dynamic-field.directive';
import { FormValidatorsService } from '@app/shared/forms/services/form-validators.service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { CustomTemplateComponent } from './components/custom-template/custom-template.component';

const componentsList = [
  DynamicFieldDirective,
  AutocompleteDirective,
  ErrorMessageComponent,
  FormComponent,
  FormContentComponent,
  FormControlGroupComponent,
  FormControlFieldComponent,
  CustomTemplateComponent,
  SizePickerComponent,
  NumberComponent,
  NumberWrapperComponent,
  TextInputComponent,
  TextInputWrapperComponent,
  TextAreaComponent,
  TextAreaWrapperComponent,
  AutoCompleteComponent,
  AutoCompleteWrapperComponent,
  AutoCompleteAsyncWrapperComponent,
  RadioGroupComponent,
  RadioGroupWrapperComponent,
  CheckboxGroupComponent,
  CheckboxGroupWrapperComponent,
  SelectComponent,
  SelectWrapperComponent,
  DatePickerComponent,
  DatePickerWrapperComponent,
  ArrayComponent
];

const entryComponents = [
  CustomTemplateComponent,
  NumberWrapperComponent,
  TextInputWrapperComponent,
  TextAreaWrapperComponent,
  AutoCompleteWrapperComponent,
  AutoCompleteAsyncWrapperComponent,
  RadioGroupWrapperComponent,
  CheckboxGroupComponent,
  CheckboxGroupWrapperComponent,
  SelectWrapperComponent,
  DatePickerWrapperComponent,
  ArrayComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    DirectivesModule,
    PipesModule,
    StoreModule.forFeature(formsStoreName, formsReducer, {
      initialState: formsInitialState
    }),
    EffectsModule.forFeature([FormsEffects])
  ],
  providers: [FormValidatorsService],
  declarations: [...componentsList],
  exports: [...componentsList],
  entryComponents: [...entryComponents]
})
export class FormsModule {}
