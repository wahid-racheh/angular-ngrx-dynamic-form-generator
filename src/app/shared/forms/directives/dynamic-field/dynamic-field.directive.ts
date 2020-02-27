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
import { RadioWrapperComponent } from '@app/shared/forms/components/radio/radio.component';
import { SelectWrapperComponent } from '@app/shared/forms/components/select/select.component';
import { TextAreaWrapperComponent } from '@app/shared/forms/components/text-area/text-area.component';
import { TextInputWrapperComponent } from '@app/shared/forms/components/text-input/text-input.component';
import { FieldType, FormControlType } from '@app/shared/forms/interfaces/types';

const componentsMapper: { [key: string]: Type<any> } = {
  [FieldType.TEXT]: TextInputWrapperComponent,
  [FieldType.TEXTAREA]: TextAreaWrapperComponent,
  [FieldType.NUMBER]: NumberWrapperComponent,
  [FieldType.AUTOCOMPLETE]: AutoCompleteWrapperComponent,
  [FieldType.ASYNC_AUTOCOMPLETE]: AutoCompleteAsyncWrapperComponent,
  [FieldType.RADIO]: RadioWrapperComponent,
  [FieldType.CHECKBOX_GROUP]: CheckboxGroupWrapperComponent,
  [FieldType.SELECT]: SelectWrapperComponent,
  [FieldType.DATE_PICKER]: DatePickerWrapperComponent,
  [FieldType.ARRAY]: ArrayComponent
};

@Directive({
  selector: '[appDynamicField]'
})
export class DynamicFieldDirective implements OnInit, OnChanges {
  @Input() public field: FormControlType;
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
      const component = this.resolver.resolveComponentFactory<any>(
        this.field.componentRef ? this.field.componentRef : componentsMapper[this.field.type]
      );
      this.component = this.container.createComponent(component);
      this.component.instance.field = this.field;
      this.component.instance.group = this.group;
    }
  }
}
