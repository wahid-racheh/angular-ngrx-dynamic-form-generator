import { inject, TestBed } from '@angular/core/testing';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { SizeEnum } from '@app/core/types/size.enum';
import {
  IProductFormInterface,
  ProductTypesEnum
} from '@app/demo/interfaces/product-form.interface';
import { ProductFormValidatorsService } from '@app/demo/services/product-form-validators.service';
import { ProductFormService } from '@app/demo/services/product-form.service';
import { FormValidatorsService } from '@app/shared/forms/services/form-validators.service';

describe('ProductFormService', () => {
  let productFormService: ProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [ProductFormService, ProductFormValidatorsService, FormValidatorsService]
    });
  });

  beforeEach(inject([ProductFormService], (service: ProductFormService) => {
    productFormService = service;
  }));

  describe('Data initialization', () => {
    let data: IProductFormInterface;
    beforeEach(() => {
      data = {
        products: [
          {
            types: [
              {
                selected: false,
                name: ProductTypesEnum.OPTION1
              },
              {
                selected: true,
                name: ProductTypesEnum.OPTION2
              },
              {
                selected: true,
                name: ProductTypesEnum.OPTION3
              }
            ],
            size: SizeEnum.MEDIUM
          }
        ],
        customerDetails: {
          phoneNumber: '123'
        }
      } as any;
    });

    it('should create a product from a data object', () => {
      const order = productFormService.createProductOrder(data);
      expect(order.products.length).toEqual(1);
      expect(order.customerDetails.phoneNumber).toEqual('123');
    });

    it('should extract selected types only', () => {
      const order = productFormService.createProductOrder(data);
      expect(order.products[0].types.length).toEqual(2);
    });

    it('should convert types data structure to enum array', () => {
      const order = productFormService.createProductOrder(data);
      expect(order.products[0].types[0]).toEqual(ProductTypesEnum.OPTION2);
    });
  });

  it('should return only selected types', () => {
    const selectedTypes = productFormService.getSelectedTypes([
      {
        name: ProductTypesEnum.OPTION1,
        selected: false
      },
      {
        name: ProductTypesEnum.OPTION2,
        selected: true
      },
      {
        name: ProductTypesEnum.OPTION3,
        selected: false
      }
    ]);

    expect(selectedTypes.length).toEqual(1);
    expect(selectedTypes[0].name).toEqual(ProductTypesEnum.OPTION2);
  });
});
