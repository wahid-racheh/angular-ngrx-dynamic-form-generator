import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

import { ProductFormService } from '@app/demo/services/product-form.service';

@Component({
  selector: 'app-selected-product-viewer',
  templateUrl: './selected-product-viewer.component.html',
  styleUrls: ['./selected-product-viewer.component.scss']
})
export class SelectedProductViewerComponent {
  @Input() public selectedProductGroup: AbstractControl;
  @Output() public addProduct = new EventEmitter();

  public availableTypes: any[];

  get typesArray(): FormArray {
    if (!this.selectedProductGroup) {
      return;
    }

    return this.selectedProductGroup.get('types') as FormArray;
  }

  constructor(private productFormService: ProductFormService) {
    this.availableTypes = this.productFormService.availableTypes;
  }
}
