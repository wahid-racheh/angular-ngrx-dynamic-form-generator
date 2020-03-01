import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { IProductFormInterface } from '@app/demo/interfaces/product-form.interface';
import { ProductFormValidatorsService } from '@app/demo/services/product-form-validators.service';
import { ProductFormService } from '@app/demo/services/product-form.service';
import { FormsFacade } from '@app/shared/forms/+store/forms.facade';
import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';
import { unsubscribe } from '@app/core/utils/utils';
import { addFormArray, removeFormArrayAt, getCheckboxStaticGroup } from '@app/shared/forms/helpers/form-helpers';
import { takeUntil } from 'rxjs/operators';
import { UserFacade } from '@app/core/services/user/+store/user.facade';
import { User } from '@app/core/services/user/models/user.interface';

@Component({
  selector: 'app-product-form-container',
  templateUrl: './product-form-container.component.html',
  styleUrls: ['./product-form-container.component.scss'],
  providers: [ProductFormService, ProductFormValidatorsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormContainerComponent implements OnInit, OnDestroy {

  public data$: Observable<any> = this.formsFacade.data$;
  public formConfig$: Observable<NgxFormConfig> = this.formsFacade.formConfig$;

  private unsubscribe$: Subject<void> = new Subject<void>();

  public form: FormGroup;
  public formConfig: NgxFormConfig;
  
  private initialData:any;

  constructor(
    private productFormService: ProductFormService,
    private formsFacade: FormsFacade,
    private userFacade: UserFacade
  ) {
    this.formConfig = this.productFormService.formConfig;
    this.initialData = {
      customerDetails:{
         gender: 'M',
      }
   };

   this.onAddProduct
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.handleAddProduct());

    this.onCustomerSearch
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(term => this.handleSearchCustomer(term));

    this.onSelectCustomer
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(customer => this.handleSelectCustomer(customer));

    this.userFacade.user$.pipe(takeUntil(this.unsubscribe$)).subscribe((customer: any) => {
        if (customer && this.customerDetailsGroup) {
          this.customerDetailsGroup.patchValue(
            {
              firstName: customer.username,
              lastName: customer.name,
              phoneNumber: customer.phone,
              address: {
                street: customer.address.street,
                suite: customer.address.suite,
                city: customer.address.city,
                zipcode: customer.address.zipcode
              }
            },
            { emitEvent: false }
          );
        }
      });
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
    this.initProductTypes(); 
  }

  public handleUpdateData(changes) {
    this.formsFacade.updateData(changes);
  }

  public handleReset() {
    while (this.productsArray.length) {
      this.onProductDelete(0)
    }
    this.form.reset();
    this.formsFacade.setData(this.initialData);
  }

  public async handleSubmit({ valid, value }) {
    if (!valid) {
      this.onProductDelete(0);
      return;
    }
    const data: IProductFormInterface = { ...value };
    this.formsFacade.updateData(data);
    const order: IProductFormInterface = this.productFormService.createProductOrder(data);
    alert(`Thanks ${order.customerDetails.firstName}, the product is on the way!`);
  }

  public selectProductForEdit(index: number) {
    if (this.form) {
      this.form.get('selectedProduct').setValue(index, { onlySelf: true, emitEvent: false });
    }
  }

  public handleSearchCustomer(searchTerm: string) {
    this.userFacade.search(searchTerm);
  }

  public handleSelectCustomer(customer: User) {
    this.userFacade.getUser(customer.id.toString());
  }

  public handleAddProduct() {
    addFormArray(this.productsArray, this.controls.products); 
    this.initProductTypes();   
  }

  private initProductTypes() {
    if (this.productsArray) {
      const index = !!this.productsArray.length ? this.productsArray.length - 1 : 0;
      const productTypes = this.productsArray.at(index).get('types') as FormArray;
      if (!productTypes.value.length) {
        this.productFormService.availableTypes.forEach((item: any) => {
          productTypes.push(getCheckboxStaticGroup(item.key, item.value, false));
        });
      }
      this.selectProductForEdit(index);
    }
  }

  public onProductDelete(index: number) {
    removeFormArrayAt(this.productsArray, index);    
  }

  public onProductSelected(index: number) {
    this.selectProductForEdit(index);
  }

  /**
   * Getters
   */
  public get controls(): any {
    return this.formConfig.controlsMap || null;
  }

  public get productsArray(): FormArray {
    return this.form.get(this.controls.products.key) as FormArray;
  }

  public get customerDetailsGroup(): FormGroup {
    if (!this.form) {
      return;
    }
    return this.form.get(this.controls.customerDetails.key) as FormGroup;
  }
  
  public get selectedProductGroup(): AbstractControl {
    if (!this.form || !this.productsArray.length) {
      return;
    }
    return this.productsArray.at(this.form.get(this.controls.selectedProduct.key).value);
  }

  private get onAddProduct(): EventEmitter<any> {
    const {
      productViewer: {
        templateOptions: {
          events: { onAddProduct }
        }
      }
    } = this.controls;
    return onAddProduct;
  }

  private get onCustomerSearch(): EventEmitter<any> {
    const {
      customer: {
        templateOptions: {
          events: { onSearch }
        }
      }
    } = this.controls;
    return onSearch;
  }

  private get onSelectCustomer(): EventEmitter<any> {
    const {
      customer: {
        templateOptions: {
          events: { onSelectItem }
        }
      }
    } = this.controls;
    return onSelectItem;
  }
}
