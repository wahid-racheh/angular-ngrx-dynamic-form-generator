import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  Type,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ArrayComponent } from '@app/shared/forms/components/array/array.component';
import {
  AutoCompleteAsyncWrapperComponent,
  AutoCompleteWrapperComponent
} from '@app/shared/forms/components/auto-complete/auto-complete.component';
import { CheckboxGroupWrapperComponent } from '@app/shared/forms/components/checkbox-group/checkbox-group.component';
import { DatePickerWrapperComponent } from '@app/shared/forms/components/date-picker/date-picker.component';
import { NumberWrapperComponent } from '@app/shared/forms/components/number/number.component';
import { RadioGroupWrapperComponent } from '@app/shared/forms/components/radio-group/radio-group.component';
import { SelectWrapperComponent } from '@app/shared/forms/components/select/select.component';
import { TextAreaWrapperComponent } from '@app/shared/forms/components/text-area/text-area.component';
import { TextInputWrapperComponent } from '@app/shared/forms/components/text-input/text-input.component';
import { NgxFormControlType, NgxAbstractFormControl } from '@app/shared/forms/interfaces/types';
import { CustomTemplateComponent } from '@app/shared/forms/components/custom-template/custom-template.component';

const componentsMapper: { [key: string]: Type<any> } = {
  [NgxFormControlType.TEXT]: TextInputWrapperComponent,
  [NgxFormControlType.TEXTAREA]: TextAreaWrapperComponent,
  [NgxFormControlType.NUMBER]: NumberWrapperComponent,
  [NgxFormControlType.AUTOCOMPLETE]: AutoCompleteWrapperComponent,
  [NgxFormControlType.ASYNC_AUTOCOMPLETE]: AutoCompleteAsyncWrapperComponent,
  [NgxFormControlType.RADIO_GROUP]: RadioGroupWrapperComponent,
  [NgxFormControlType.CHECKBOX_GROUP]: CheckboxGroupWrapperComponent,
  [NgxFormControlType.SELECT]: SelectWrapperComponent,
  [NgxFormControlType.DATE_PICKER]: DatePickerWrapperComponent,
  [NgxFormControlType.ARRAY]: ArrayComponent,
  [NgxFormControlType.CUSTOM_TEMPLATE]: CustomTemplateComponent
};

@Directive({
  selector: '[appDynamicField]'
})
export class DynamicFieldDirective implements OnInit, OnChanges {
  @Input() public field: NgxAbstractFormControl;
  @Input() public group: FormGroup;

  public component: ComponentRef<any>;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

  public ngOnChanges() {
    if (this.field && this.field.isDynamic && this.component) {
      this.component.instance.field = this.field;
      this.component.instance.group = this.group;
    }
  }

  public ngOnInit() {
    if (this.field && this.field.isDynamic) {
      const componentRef: any = this.field.componentRef ? this.field.componentRef : componentsMapper[this.field.type];
      const component = this.resolver.resolveComponentFactory<any>(componentRef);
      this.component = this.container.createComponent(component);
      this.component.instance.field = this.field;
      this.component.instance.group = this.group;
    }
  }
}
