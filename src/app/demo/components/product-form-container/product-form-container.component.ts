import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { DEMO_PRODUCT } from '@app/demo/constants/demo-product-item';
import { IProductFormInterface } from '@app/demo/interfaces/product-form.interface';
import { ProductFormValidatorsService } from '@app/demo/services/product-form-validators.service';
import { ProductFormService } from '@app/demo/services/product-form.service';
import { ProductLoaderService } from '@app/demo/services/product-loader.service';
import { FormsFacade } from '@app/shared/forms/+store/forms.facade';
import { FormControlsConfig } from '@app/shared/forms/classes/form-config.class';
import { unsubscribe } from '@app/core/utils/utils';
import { addFormArray, removeFormArrayAt, getCheckboxStaticGroup } from '@app/shared/forms/helpers/form-helpers';

@Component({
  selector: 'app-product-form-container',
  templateUrl: './product-form-container.component.html',
  styleUrls: ['./product-form-container.component.scss'],
  providers: [ProductFormService, ProductFormValidatorsService, ProductLoaderService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormContainerComponent implements OnInit, OnDestroy {

  public data$: Observable<any> = this.formsFacade.data$;
  public formConfig$: Observable<FormControlsConfig> = this.formsFacade.formConfig$;

  private unsubscribe$: Subject<void> = new Subject<void>();

  public form: FormGroup;
  public formConfig: FormControlsConfig;
  
  public editMode = false;
  
  private initialData:any;

  get productsArray(): FormArray {
    return this.form.get(this.formConfig.controlsMap.products.key) as FormArray;
  }
  
  get selectedProductGroup(): AbstractControl {
    if (!this.form || !this.productsArray.length) {
      return;
    }
    return this.productsArray.at(this.form.get(this.formConfig.controlsMap.selectedProduct.key).value);
  }

  constructor(
    private productLoaderService: ProductLoaderService,
    private productFormService: ProductFormService,
    private formsFacade: FormsFacade
  ) {
    this.formConfig = this.productFormService.formConfig;
    this.initialData = {
      products: [],
      customerDetails:{
         address:{
            street: '',
            suite: '',
            city: '',
            zipcode: ''
         },
         customer: '',
         firstName: '',
         lastName: '',
         gender: 'M',
         dob: '1990-02-27T20:13:05.010Z',
         phoneNumber: ''
      },
      selectedProduct: ''
   };
  }

  public ngOnInit() {
    this.formsFacade.setFormConfig(this.formConfig);
    // here you can check the page url if a product order id was specified
    // and load it from the server
    if (this.editMode) {
      this.productLoaderService.loadProductForEdit(DEMO_PRODUCT);
    }
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
      this.productsArray.removeAt(0);
    }
    this.form.reset();
    this.formsFacade.setData(this.initialData);
  }

  public async handleSubmit({ valid, value }) {
    if (!valid) {
      alert(`Please fill the form by the right data`);
      return;
    }
    const data: IProductFormInterface = { ...value };
    this.formsFacade.updateData(data);
    const order: IProductFormInterface = this.productFormService.createProductOrder(data);

    alert(`Thanks ${order.customerDetails.firstName}, the product is on the way!`);

    if (this.editMode) {
      // update api endpoint call
    } else {
      // create api endpoint call
    }
  }

  public selectProductForEdit(index: number) {
    if (this.form) {
      this.form.get('selectedProduct').setValue(index, { onlySelf: true, emitEvent: false });
    }
  }

  public onProductAdd() {
    addFormArray(this.productsArray, this.formConfig.controlsMap.products); 
    this.initProductTypes();   
  }

  private initProductTypes() {
    const index = !!this.productsArray.length ? this.productsArray.length - 1 : 0;
    const productTypes = this.productsArray.at(index).get('types') as FormArray;
    if (!productTypes.value.length) {
      this.productFormService.availableTypes.forEach((item: any) => {
        productTypes.push(getCheckboxStaticGroup(item.key, item.value, false));
      });
    }
    this.selectProductForEdit(index);
  }

  public onProductDelete(index: number) {
    removeFormArrayAt(this.productsArray, index);    
  }

  public onProductSelected(index: number) {
    this.selectProductForEdit(index);
  }
}
