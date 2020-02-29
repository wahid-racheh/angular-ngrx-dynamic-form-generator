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
import { FormControlsConfig } from '@app/shared/forms/classes/form-config.class';
import { FieldType, FormControlType } from '@app/shared/forms/interfaces/types';
import { UserFacade } from '@app/core/services/user/+store/user.facade';
import { CustomerAddressComponent } from '@app/demo/components/customer-address/customer-address.component';

@Injectable()
export class ProductFormService {
  public form: FormGroup;
  public formConfig: FormControlsConfig;

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
 
    this.formConfig = new FormControlsConfig({
      controls: [
        {
          key: 'selectedProduct',
          type: FieldType.TEXT,
          isDynamic: false,
          templateOptions: {
            displayOrder: 1,
            label: 'Selected product'
          }
        },
        {
          key: 'products',
          type: FieldType.ARRAY,
          isDynamic: false,
          templateOptions: {
            displayOrder: 2
          },
          validators: [this.productValidatorsService.productItemValidator()],
          childrens: [
            {
              key: 'size',
              type: FieldType.TEXT,
              isDynamic: false,
              templateOptions: {
                displayOrder: 3,
                label: 'First Name',
                placeholder: 'First Name',
                defaultValue: SizeEnum.MEDIUM
              },
              validators: [Validators.required]
            },
            {
              key: 'types',
              type: FieldType.CHECKBOX_GROUP,
              isDynamic: false,
              templateOptions: {
                displayOrder: 4,
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
              },
              validators: [Validators.required]
            }
          ]
        },
        {
          key: 'customerDetails',
          type: FieldType.GROUP,
          templateOptions: {
            displayOrder: 5
          },
          validators: [this.productValidatorsService.productFormValidator()],
          childrens: [
            {
              key: 'customer',
              type: FieldType.ASYNC_AUTOCOMPLETE,
              templateOptions: {
                displayOrder: 6,
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
              },
              validators: [Validators.required]
            },
            {
              key: 'firstName',
              type: FieldType.TEXT,
              templateOptions: {
                displayOrder: 7,
                label: 'First Name',
                placeholder: 'First Name'
              },
              validators: [Validators.required]
            },
            {
              key: 'lastName',
              type: FieldType.TEXT,
              templateOptions: {
                displayOrder: 8,
                label: 'Last Name',
                placeholder: 'Last Name'
              },
              validators: [Validators.required]
            },
            {
              key: 'gender',
              type: FieldType.RADIO,
              templateOptions: {
                displayOrder: 9,
                label: 'Gender',
                placeholder: 'Gender',
                events: {
                  onChange: new EventEmitter()
                }
              },
              extraOptions: {
                data: this.genderList,
                selectedValue: this.genderList[0],
                optionKey: 'text',
                optionValue: 'id'
              },
              validators: [Validators.required]
            },
            {
              key: 'dob',
              type: FieldType.DATE_PICKER,
              templateOptions: {
                displayOrder: 10,
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
              },
              validators: [Validators.required]
            },
            {
              key: 'phoneNumber',
              type: FieldType.TEXT,
              templateOptions: {
                displayOrder: 11,
                label: 'Phone Number',
                placeholder: 'Phone Number'
              },
              validators: [
                Validators.compose([
                  Validators.required,
                  Validators.minLength(8),
                  Validators.maxLength(12)
                ])
              ]
            },
            {
              key: 'address',
              type: FieldType.GROUP,
              componentRef: CustomerAddressComponent,
              templateOptions: {
                displayOrder: 12
              },
              childrens: [
                {
                  key: 'street',
                  type: FieldType.TEXT,
                  templateOptions: {
                    displayOrder: 13,
                    label: 'Street',
                    placeholder: 'Street'
                  },
                  validators: [Validators.required]
                },
                {
                  key: 'suite',
                  type: FieldType.TEXT,
                  templateOptions: {
                    displayOrder: 14,
                    label: 'Apt. Number',
                    placeholder: 'Apt. Number'
                  },
                  validators: [Validators.required]
                },
                {
                  key: 'city',
                  type: FieldType.TEXT,
                  templateOptions: {
                    displayOrder: 15,
                    label: 'City',
                    placeholder: 'City'
                  },
                  validators: [Validators.required]
                },
                {
                  key: 'zipcode',
                  type: FieldType.TEXT,
                  templateOptions: {
                    displayOrder: 16,
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
