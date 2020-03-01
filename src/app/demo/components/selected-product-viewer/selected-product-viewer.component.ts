import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

import { NgxAbstractFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-selected-product-viewer',
  templateUrl: './selected-product-viewer.component.html',
  styleUrls: ['./selected-product-viewer.component.scss']
})
export class SelectedProductViewerComponent implements OnInit {
  @Input() public group: AbstractControl;
  @Input() public field: NgxAbstractFormControl;

  public availableTypes: any[];

  get productsArray(): FormArray {
    return this.group.get('products') as FormArray;
  }

  get selectedProductGroup(): AbstractControl {
    if (!this.productsArray || !this.productsArray.length) {
      return;
    }
    return this.productsArray.at(this.group.get('selectedProduct').value);
  }

  get typesArray(): FormArray {
    if (!this.selectedProductGroup) {
      return;
    }

    return this.selectedProductGroup.get('types') as FormArray;
  }

  public ngOnInit(): void {
    this.availableTypes = this.field.extraOptions.data;
  }

  public addProduct(): void {
    this.field.templateOptions.events.onAddProduct.emit();
  }
}
