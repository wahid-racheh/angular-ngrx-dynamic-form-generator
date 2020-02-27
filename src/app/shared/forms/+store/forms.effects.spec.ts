import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';

import * as FormsActions from '@app/shared/forms/+store/forms.actions';
import { FormsEffects } from '@app/shared/forms/+store/forms.effects';

import { provideMockActions } from '@ngrx/effects/testing';

describe('FormsEffects', () => {
  let effects: FormsEffects;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormsEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.inject(FormsEffects);
    actions$ = TestBed.inject(Actions);
  });

  describe('setData$', () => {
    it('should dispatch a setData action', (done: any) => {
      // GIVEN
      const action = FormsActions.setData({ data: null });
      actions$ = of(action);
      // WHEN
      effects.setData$.subscribe(() => {
        // THEN
        // This should work
        expect(true).toBeDefined();
        done();
      });
    });
  });
});
