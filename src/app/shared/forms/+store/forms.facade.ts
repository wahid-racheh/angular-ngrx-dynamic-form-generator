import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormGroup } from '@angular/forms';
import * as FormsActions from '@app/shared/forms/+store/forms.actions';
import { FormsState } from '@app/shared/forms/+store/forms.reducer';
import { formQuery } from '@app/shared/forms/+store/forms.selectors';
import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';

@Injectable({
  providedIn: 'root'
})
export class FormsFacade {
  public form$ = this.store.select(formQuery.getForm);
  public data$ = this.store.select(formQuery.getData);
  public formConfig$ = this.store.select(formQuery.getFormConfig);
  public errors$ = this.store.select(formQuery.getErrors);
  public touched$ = this.store.select(formQuery.getTouchedForm);
  public resetFlag$ = this.store.select(formQuery.getResetFlag);

  constructor(private store: Store<FormsState>) {}

  public setFormConfig(formConfig: NgxFormConfig) {
    this.store.dispatch(FormsActions.setFormConfig({ formConfig }));
  }

  public setData(data: any) {
    this.store.dispatch(FormsActions.setData({ data }));
  }

  public setForm(form: FormGroup) {
    this.store.dispatch(FormsActions.setForm({ form }));
  }

  public updateData(data: any) {
    this.store.dispatch(FormsActions.updateData({ data }));
  }

  public initializeForm() {
    this.store.dispatch(FormsActions.initializeForm());
  }

  public initializeErrors() {
    this.store.dispatch(FormsActions.initializeErrors());
  }

  public resetForm() {
    this.store.dispatch(FormsActions.resetForm());
  }
}
