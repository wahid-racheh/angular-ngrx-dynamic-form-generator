import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { UserFacade } from '@app/core/services/user/+store/user.facade';
import { SizeEnum } from '@app/core/types/size.enum';
import { CustomerAddressComponent } from '@app/demo/components/customer-address/customer-address.component';
import { IProductFormInterface, ITypeItem, ProductTypesEnum } from '@app/demo/interfaces/product-form.interface';
import { ProductFormValidatorsService } from '@app/demo/services/product-form-validators.service';
import { INgxFormConfig, NgxFormConfig } from '@app/shared/forms/classes/form-config.class';
import { NgxFormControlType } from '@app/shared/forms/interfaces/types';
import moment from 'moment';
import { of } from 'rxjs';
import { CustomTextComponent } from '../components/custom-text/custom-text.component';
import { SelectedProductViewerComponent } from '../components/selected-product-viewer/selected-product-viewer.component';

@Injectable()
export class ProductFormService {
  public form: FormGroup;
  public formConfig: NgxFormConfig;
  public ngxFormPageConfig: NgxFormConfig;

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
    };
  });

  constructor(private productValidatorsService: ProductFormValidatorsService) {
    this.formConfig = new NgxFormConfig(this.productFormConfig);
    this.ngxFormPageConfig = new NgxFormConfig(this.ngxFormPageAllFieldsConfig);
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

  /**
   * Product form config
   */
  // tslint:disable-next-line:no-big-function
  private get productFormConfig(): INgxFormConfig {
      return {
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
                        Customer details
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
                type: NgxFormControlType.RADIO_GROUP,
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
      };
  }
  /**
   * All fields Config
   */
  // tslint:disable-next-line:no-big-function
  private get ngxFormPageAllFieldsConfig(): INgxFormConfig {
    return {
      controls: [
        {
          key: 'basicFieldsGroup',
          type: NgxFormControlType.GROUP,
          templateOptions: {
              displayOrder: 0
          },
          childrens: [
            {
              key: 'customTemplate1',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
              <div class="row">
                  <div class="col-md-12">
                      <h5>
                          Basic Fields
                      </h5>
                  </div>
              </div>
              `,
              templateOptions: {
                  displayOrder: 0
              }
            },
            {
              key: 'inputText',
              type: NgxFormControlType.TEXT,
              templateOptions: {
                displayOrder: 0,
                label: 'Text',
                placeholder: 'Text',
                events: {
                  onChange: new EventEmitter(),
                  onBlur: new EventEmitter(),
                  onFocus: new EventEmitter()
                }
              }
            },
            {
              key: 'inputNumber',
              type: NgxFormControlType.NUMBER,
              templateOptions: {
                displayOrder: 0,
                label: 'Number',
                placeholder: 'Number',
                events: {
                  onChange: new EventEmitter(),
                  onBlur: new EventEmitter(),
                  onFocus: new EventEmitter()
                }
              }
            },
            {
              key: 'textArea',
              type: NgxFormControlType.TEXTAREA,
              templateOptions: {
                displayOrder: 0,
                label: 'Textarea',
                placeholder: 'Textarea',
                events: {
                  onChange: new EventEmitter(),
                  onBlur: new EventEmitter(),
                  onFocus: new EventEmitter()
                }
              }
            },
            {
              key: 'datePicker',
              type: NgxFormControlType.DATE_PICKER,
              templateOptions: {
                displayOrder: 0,
                label: 'Date Picker',
                placeholder: 'Date Picker',
                events: {
                  onChange: new EventEmitter()
                }
              },
              extraOptions: {
                defaultValue: this.maxDate.clone().subtract(2, 'years'),
                minDate: this.maxDate.clone().subtract(4, 'days'),
                maxDate: this.maxDate
              }
            },
            {
              key: 'select',
              type: NgxFormControlType.SELECT,
              templateOptions: {
                displayOrder: 0,
                label: 'Select',
                placeholder: 'Select',
                events: {
                  onChange: new EventEmitter()
                }
              },
              extraOptions: {
                  data: this.availableTypes,
                  selectedValue: this.availableTypes[0].value,
                  optionKey: 'key',
                  optionValue: 'value'
              }
            }
          ]
        },
        {
          key: 'autocompleteGroup',
          type: NgxFormControlType.GROUP,
          templateOptions: {
              displayOrder: 0
          },
          childrens: [
            {
              key: 'customTemplate2',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
              <div class="row">
                  <div class="col-md-12">
                      <h5>
                          Autocompletes
                      </h5>
                  </div>
              </div>
              `,
              templateOptions: {
                  displayOrder: 0
              }
            },
            {
              key: 'asyncAutoCompleteWithApi',
              type: NgxFormControlType.ASYNC_AUTOCOMPLETE,
              templateOptions: {
                  displayOrder: 0,
                  label: 'Autocomplete With api call (search nichola)',
                  placeholder: 'Autocomplete with api call (search nichola)',
                  events: {
                      onReset: new EventEmitter(),
                      onSelectItem: new EventEmitter(),
                      onSearch: new EventEmitter()
                    }
                },
                extraOptions: {
                  // It is important to set asyncQuery to true, as well as asyncData when we use async autocomplete
                  asyncQuery: true,
                  asyncData: {
                    provider: UserFacade,
                    dataSelectorName: 'userList$',
                    loadingSelectorName: 'isLoading$'
                  },
                  searchKey: 'name',
                  debounceTime: 300,
                  minLength: 2
                }
            },
            {
              key: 'autoComplete',
              type: NgxFormControlType.AUTOCOMPLETE,
              templateOptions: {
                displayOrder: 0,
                label: 'Autocomplete',
                placeholder: 'Autocomplete',
                events: {
                  onReset: new EventEmitter(),
                  onSelectItem: new EventEmitter(),
                  onSearch: new EventEmitter()
                }
              },
              extraOptions: {
                  data: this.availableTypes,
                  searchKey: 'value',
                  debounceTime: 300,
                  minLength: 2
              }
            },
            {
              key: 'autoCompleteWithObservable',
              type: NgxFormControlType.AUTOCOMPLETE,
              templateOptions: {
                displayOrder: 0,
                label: 'Autocomplete with observable',
                placeholder: 'Autocomplete with observable',
                events: {
                  onReset: new EventEmitter(),
                  onSelectItem: new EventEmitter(),
                  onSearch: new EventEmitter()
                }
              },
              extraOptions: {
                  data: of(this.availableTypes),
                  searchKey: 'value',
                  debounceTime: 300,
                  minLength: 2
              }
            }
          ]
        },
        {
          key: 'radioGroup',
          type: NgxFormControlType.GROUP,
          templateOptions: {
              displayOrder: 0
          },
          childrens: [
            {
              key: 'customTemplate3',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
              <div class="row mt-3">
                  <div class="col-md-12">
                      <h5>
                          Radio group
                      </h5>
                  </div>
              </div>
              `,
              templateOptions: {
                  displayOrder: 0
              }
            },
            {
              key: 'radio',
              type: NgxFormControlType.RADIO_GROUP,
              templateOptions: {
                displayOrder: 0,
                label: 'Radio group',
                placeholder: 'Radio group',
                events: {
                  onChange: new EventEmitter()
                }
              },
              extraOptions: {
                  displayInline: true,
                  data: this.availableTypes,
                  selectedValues: [this.availableTypes[0], this.availableTypes[1]],
                  optionKey: 'key',
                  optionValue: 'value'
              }
            }
          ]
        },

        {
          key: 'checkboxGroup',
          type: NgxFormControlType.GROUP,
          templateOptions: {
              displayOrder: 0
          },
          childrens: [
            {
              key: 'customTemplate4',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
              <div class="row mt-3">
                  <div class="col-md-12">
                      <h5>
                          Checkbox group
                      </h5>
                  </div>
              </div>
              `,
              templateOptions: {
                  displayOrder: 0
              }
            },
            {
              key: 'checkbox',
              type: NgxFormControlType.CHECKBOX_GROUP,
              templateOptions: {
                  displayOrder: 0,
                  label: 'Checkbox group',
                  placeholder: 'Checkbox group',
                  events: {
                      onChange: new EventEmitter()
                  }
              },
              extraOptions: {
                  displayInline: true,
                  data: this.availableTypes,
                  selectedValues: [this.availableTypes[0], this.availableTypes[1]],
                  optionKey: 'key',
                  optionValue: 'value'
              }
            }
          ]
        },
        {
          key: 'otherFields',
          type: NgxFormControlType.GROUP,
          templateOptions: {
              displayOrder: 0
          },
          childrens: [
            {
              key: 'customTemplate5',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
              <div class="row mb-3">
                  <div class="col-md-12">
                      <h4>
                         Dealling with groups and nested groups
                      </h4>
                  </div>
              </div>
              `,
              templateOptions: {
                  displayOrder: 0
              }
            },
            {
              key: 'group1',
              type: NgxFormControlType.GROUP,
              templateOptions: {
                  displayOrder: 0
              },
              childrens: [
                {
                  key: 'customTemplate6',
                  type: NgxFormControlType.CUSTOM_TEMPLATE,
                  htmlTemplate: `
                  <div class="row">
                      <div class="col-md-12">
                          <h5>
                              First level group
                          </h5>
                      </div>
                  </div>
                  `,
                  templateOptions: {
                      displayOrder: 0
                  }
                },
                {
                  key: 'inputText1',
                  type: NgxFormControlType.TEXT,
                  templateOptions: {
                    displayOrder: 0,
                    label: 'Group1 > Textfield 1',
                    placeholder: 'Group1 > Textfield 1'
                  }
                },
                {
                  key: 'group2',
                  type: NgxFormControlType.GROUP,
                  templateOptions: {
                      displayOrder: 0
                  },
                  childrens: [
                    {
                      key: 'customTemplate7',
                      type: NgxFormControlType.CUSTOM_TEMPLATE,
                      htmlTemplate: `
                      <div class="row">
                          <div class="col-md-12">
                              <h5>
                                  Nested group
                              </h5>
                          </div>
                      </div>
                      `,
                      templateOptions: {
                          displayOrder: 0
                      }
                    },
                    {
                      key: 'inputText2',
                      type: NgxFormControlType.TEXT,
                      templateOptions: {
                        displayOrder: 0,
                        label: 'Group 1 > Group2 > Textfield 2',
                        placeholder: 'Group 1 > Group2 > Textfield 2'
                      }
                    },
                    {
                      key: 'inputText3',
                      type: NgxFormControlType.TEXT,
                      templateOptions: {
                        displayOrder: 0,
                        label: 'Group 1 > Group2 > Textfield 3',
                        placeholder: 'Group 1 > Group2 > Textfield 3'
                      }
                    }
                  ]
                }
              ]
            },
            {
              key: 'customTemplate8',
              type: NgxFormControlType.CUSTOM_TEMPLATE,
              htmlTemplate: `
              <div class="mt-2 row">
                  <div class="col-md-12">
                      <h4>
                          Dealing with arrays
                      </h4>
                  </div>
              </div>
              `,
              templateOptions: {
                  displayOrder: 0
              }
            },
            {
              key: 'array',
              type: NgxFormControlType.ARRAY,
              templateOptions: {
                displayOrder: 2
              },
              childrens: [
                {
                  key: 'group3',
                  type: NgxFormControlType.GROUP,
                  templateOptions: {
                      displayOrder: 0
                  },
                  childrens: [
                    {
                      key: 'customTemplate9',
                      type: NgxFormControlType.CUSTOM_TEMPLATE,
                      htmlTemplate: `
                      <div class="row">
                          <div class="col-md-12">
                              <h5>
                                  Basic Group
                              </h5>
                          </div>
                      </div>
                      `,
                      templateOptions: {
                          displayOrder: 0
                      }
                    },
                    {
                      key: 'inputText4',
                      type: NgxFormControlType.TEXT,
                      templateOptions: {
                        displayOrder: 0,
                        label: 'Group > Textfield 1',
                        placeholder: 'Group > Textfield 1'
                      }
                    },
                    {
                      key: 'inputText5',
                      type: NgxFormControlType.TEXT,
                      templateOptions: {
                        displayOrder: 0,
                        label: 'Group > Textfield 2',
                        placeholder: 'Group > Textfield 2'
                      }
                    }
                  ]
                },
                {
                  key: 'group4',
                  type: NgxFormControlType.GROUP,
                  templateOptions: {
                      displayOrder: 0
                  },
                  childrens: [
                    {
                      key: 'customTemplate10',
                      type: NgxFormControlType.CUSTOM_TEMPLATE,
                      htmlTemplate: `
                      <div class="row">
                          <div class="col-md-12">
                              <h5>
                                  Group using a custom component
                              </h5>
                          </div>
                      </div>
                      `,
                      templateOptions: {
                          displayOrder: 0
                      }
                    },
                    /**
                     * Referenced components in form config should be imported in the modules entryComponents
                     */
                    {
                      key: 'inputText5',
                      type: NgxFormControlType.TEXT,
                      componentRef: CustomTextComponent,
                      templateOptions: {
                        displayOrder: 0,
                        label: 'Group > Custom component field',
                        placeholder: 'Group > Custom component field'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }
}
