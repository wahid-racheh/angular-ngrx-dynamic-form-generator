import { Injectable, EventEmitter } from '@angular/core';
import moment from 'moment';
import { FormGroup, Validators } from '@angular/forms';

import { SizeEnum } from '@app/core/types/size.enum';
import {
  IProductFormInterface,
  ITypeItem,
  ProductTypesEnum
} from '@app/demo/interfaces/product-form.interface';
import { ProductFormValidatorsService } from '@app/demo/services/product-form-validators.service';
import { NgxFormConfig } from '@app/shared/forms/classes/form-config.class';
import { NgxFormControlType } from '@app/shared/forms/interfaces/types';
import { UserFacade } from '@app/core/services/user/+store/user.facade';
import { CustomerAddressComponent } from '@app/demo/components/customer-address/customer-address.component';
import { SelectedProductViewerComponent } from '../components/selected-product-viewer/selected-product-viewer.component';

@Injectable()
export class ProductFormService {
  public form: FormGroup;
  public formConfig: NgxFormConfig;

  public genderList = [
    { id: 'M', text: 'Man' },
    { id: 'W', text: 'Woman' }
  ];
  public defaultDate: moment.Moment = moment()
    .clone()
    .subtract(30, 'years');
  public minDate: moment.Moment = moment()
    .clone()
    .subtract(50, 'years');
  public maxDate: moment.Moment = moment();

  public availableTypes: any[] = [...Object.values(ProductTypesEnum)].map((i: string, index: number) => {
    return {
      key: i,
      value: i
    }
  });

  constructor(private productValidatorsService: ProductFormValidatorsService) {
 
    this.formConfig = new NgxFormConfig({
      controls: [
        {
          key: 'selectedProduct',
          type: NgxFormControlType.TEXT,
          isDynamic: false,
          templateOptions: {
            displayOrder: 0,
            label: 'Selected product'
          }
        },
        {
          key: 'productViewer',
          type: NgxFormControlType.CUSTOM_TEMPLATE,
          componentRef: SelectedProductViewerComponent,
          templateOptions: {
            displayOrder: 1,
            events: {
              onAddProduct: new EventEmitter()
            }
          },
          extraOptions: {
            data: this.availableTypes
          }
        },
        {
          key: 'products',
          type: NgxFormControlType.ARRAY,
          isDynamic: false,
          templateOptions: {
            displayOrder: 2
          },
          validators: [this.productValidatorsService.productItemValidator()],
          childrens: [
            {
              key: 'size',
              type: NgxFormControlType.TEXT,
              isDynamic: false,
              templateOptions: {
                displayOrder: 1,
                label: 'First Name',
                placeholder: 'First Name',
                defaultValue: SizeEnum.MEDIUM
              }
            },
            {
              key: 'types',
              type: NgxFormControlType.CHECKBOX_GROUP,
              isDynamic: false,
              templateOptions: {
                displayOrder: 2,
                label: 'Product Types',
                placeholder: 'Product Types',
                events: {
                  onChange: new EventEmitter()
                }
              },
              extraOptions: {
                displayInline: true,
                data: this.availableTypes,
                optionKey: 'key',
                optionValue: 'value'
              }
            }
          ]
        },
        {
          key: 'customerDetails',
          type: NgxFormControlType.GROUP,
          templateOptions: {
            displayOrder: 3
          },
          validators: [this.productValidatorsService.productFormValidator()],
          childrens: [
            {
              key: 'customer',
              type: NgxFormControlType.ASYNC_AUTOCOMPLETE,
              templateOptions: {
                displayOrder: 1,
                label: 'Search customer: (Nicholas)',
                events: {
                  onReset: new EventEmitter(),
                  onSelectItem: new EventEmitter(),
                  onSearch: new EventEmitter()
                }
              },
              extraOptions: {
                asyncData: {
                  provider: UserFacade,
                  dataSelectorName: 'userList$',
                  loadingSelectorName: 'isLoading$'
                },
                searchKey: 'name',
                debounceTime: 300,
                minLength: 2,
                asyncQuery: true
              }
            },
            {
              key: 'customTemplate1',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
                <div class="row">
                  <div class="col-md-12">
                    <h3>
                      This is just a custom template :
                    </h3>
                  </div>
                </div>
              `,
              templateOptions: {
                displayOrder: 0
              }
            },
            {
              key: 'firstName',
              type: NgxFormControlType.TEXT,
              templateOptions: {
                displayOrder: 2,
                label: 'First Name',
                placeholder: 'First Name'
              },
              validators: [Validators.required]
            },
            {
              key: 'lastName',
              type: NgxFormControlType.TEXT,
              templateOptions: {
                displayOrder: 3,
                label: 'Last Name',
                placeholder: 'Last Name'
              },
              validators: [Validators.required]
            },
            {
              key: 'gender',
              type: NgxFormControlType.RADIO,
              templateOptions: {
                displayOrder: 4,
                label: 'Gender',
                placeholder: 'Gender',
                events: {
                  onChange: new EventEmitter()
                }
              },
              extraOptions: {
                data: this.genderList,
                selectedValue: this.genderList[0],
                displayInline: true,
                optionKey: 'text',
                optionValue: 'id'
              },
              validators: [Validators.required]
            },
            {
              key: 'dob',
              type: NgxFormControlType.DATE_PICKER,
              templateOptions: {
                displayOrder: 5,
                label: 'Date of birth',
                placeholder: 'Date of birth',
                events: {
                  onChange: new EventEmitter()
                }
              },
              extraOptions: {
                defaultValue: this.defaultDate,
                minDate: this.minDate,
                maxDate: this.maxDate
              }
            },
            {
              key: 'phoneNumber',
              type: NgxFormControlType.TEXT,
              templateOptions: {
                displayOrder: 6,
                label: 'Phone Number',
                placeholder: 'Phone Number'
              },
              validators: [
                Validators.compose([
                  Validators.required,
                  Validators.minLength(8),
                  Validators.maxLength(20)
                ])
              ]
            },
            {
              key: 'customTemplate2',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
                <div class="row">
                  <div class="col-md-12">
                    <h3>
                      Delivery Address :
                    </h3>
                  </div>
                </div>
              `,
              templateOptions: {
                displayOrder: 7
              }
            },
            {
              key: 'address',
              type: NgxFormControlType.GROUP,
              componentRef: CustomerAddressComponent,
              templateOptions: {
                displayOrder: 8
              },
              childrens: [
                {
                  key: 'street',
                  type: NgxFormControlType.TEXT,
                  templateOptions: {
                    displayOrder: 1,
                    label: 'Street',
                    placeholder: 'Street'
                  },
                  validators: [Validators.required]
                },
                {
                  key: 'suite',
                  type: NgxFormControlType.TEXT,
                  templateOptions: {
                    displayOrder: 2,
                    label: 'Apt. Number',
                    placeholder: 'Apt. Number'
                  },
                  validators: [Validators.required]
                },
                {
                  key: 'city',
                  type: NgxFormControlType.TEXT,
                  templateOptions: {
                    displayOrder: 3,
                    label: 'City',
                    placeholder: 'City'
                  },
                  validators: [Validators.required]
                },
                {
                  key: 'zipcode',
                  type: NgxFormControlType.TEXT,
                  templateOptions: {
                    displayOrder: 0,
                    label: 'Zipcode',
                    placeholder: 'Zipcode'
                  },
                  validators: [Validators.required]
                },
              ]
            }
          ]
        }
      ]
    });
  }

  public createProductOrder(data: IProductFormInterface): IProductFormInterface {
    const order = {
      customerDetails: data.customerDetails,
      products: data.products
    };

    for (const product of order.products) {
      product.types = this.getSelectedTypes(product.types as ITypeItem[]).map((i: any) => {
        return i.name;
      });
    }

    return order;
  }

  public getSelectedTypes(types: ITypeItem[]): ITypeItem[] {
    return types.filter(i => i.selected);
  }
}
