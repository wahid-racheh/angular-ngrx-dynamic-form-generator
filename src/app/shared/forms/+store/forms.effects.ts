import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as FormActions from '@app/shared/forms/+store/forms.actions';

@Injectable()
export class FormsEffects {
  constructor(private actions$: Actions) {}

  public setData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.setData, FormActions.updateData),
      map(action => ({ type: FormActions.initializeErrors.type }))
    )
  );
}
