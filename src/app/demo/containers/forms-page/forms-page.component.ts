import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserFacade } from '@app/core/services/user/+store/user.facade';
import { unsubscribe } from '@app/core/utils/utils';
import { ProductFormValidatorsService } from '@app/demo/services/product-form-validators.service';
import { ProductFormService } from '@app/demo/services/product-form.service';
import { FormsFacade } from '@app/shared/forms/+store/forms.facade';
import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrls: ['./forms-page.component.scss'],
  providers: [ProductFormService, ProductFormValidatorsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsPageComponent implements OnInit, OnDestroy {
  public data$: Observable<any> = this.formsFacade.data$;
  public formConfig$: Observable<NgxFormConfig> = this.formsFacade.formConfig$;

  private unsubscribe$: Subject<void> = new Subject<void>();

  public form: FormGroup;
  public formConfig: NgxFormConfig;

  constructor(
    private formsFacade: FormsFacade,
    private userFacade: UserFacade,
    private productFormService: ProductFormService
  ) {
    this.formConfig = new NgxFormConfig(this.productFormService.ngxFormPageConfig);

    // Handle async autocomplete events
    // By calling user apis
    // Call search user using autocomplete search term
    this.asyncAutoCompleteWithApi.onSearch
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(term => this.handleSearchUser(term));

    // Call get user api when selecting user from autocomplete list
    this.asyncAutoCompleteWithApi.onSelectItem
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => this.handleSelectUser(user));

    // Handle user data when receiving the response
    this.userFacade.user$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((user: any) => this.setUserDetails(user));
  }

  public ngOnInit() {
    this.formsFacade.setFormConfig(this.formConfig);
  }

  public ngOnDestroy() {
    unsubscribe(this.unsubscribe$);
    this.formsFacade.initializeForm();
  }

  public handleInitForm(form) {
    this.form = form;
  }

  public handleUpdateData(changes) {
    this.formsFacade.updateData(changes);
  }

  /**
   * User apis
   */
  private handleSearchUser(searchTerm: string) {
    this.userFacade.search(searchTerm);
  }

  private handleSelectUser(user: any) {
    this.userFacade.getUser(user.id);
  }

  private setUserDetails(user): void {
    if (user) {
      this.form.get('basicFieldsGroup').patchValue(
        {
          inputText: user.username,
          inputNumber: parseInt(user.address.zipcode, 4),
          textArea: `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`
        },
        { emitEvent: false }
      );
    }
  }

  /**
   * Getters
   */
  // Return async autocomplete field events
  private get asyncAutoCompleteWithApi(): any {
    const {
      asyncAutoCompleteWithApi: {
        templateOptions: {
          events
        }
      }
    } = this.formConfig.controlsMap;
    return events;
  }
}
