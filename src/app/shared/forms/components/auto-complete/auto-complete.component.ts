import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  TypeProvider
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BaseInput } from '@app/shared/forms/classes/base-input.class';
import { NgxFormControl } from '@app/shared/forms/interfaces/types';

@Component({
  selector: 'app-auto-complete-wrapper',
  template: `
    <app-auto-complete
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [disabled]="field?.templateOptions?.disabled"
      [label]="field?.templateOptions?.label"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [inputStyle]="field?.templateOptions?.inputStyle"
      [placeholder]="field?.templateOptions?.placeholder"
      [attributes]="field?.templateOptions?.attributes"
      (onSelectItem)="field?.templateOptions?.events?.onSelectItem.emit($event)"
      (onSearch)="field?.templateOptions?.events?.onSearch.emit($event)"
      (onReset)="field?.templateOptions?.events?.onReset.emit($event)"
      [data]="field?.extraOptions?.data"
      [showSpinner]="false"
      [asyncQuery]="false"
      [searchKey]="field?.extraOptions?.searchKey"
      [debounceTime]="field?.extraOptions?.debounceTime"
      [minLength]="field?.extraOptions?.minLength"
    ></app-auto-complete>
  `,
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteWrapperComponent {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: FormControl;

  @Output()
  public onSelectItem: EventEmitter<void> = new EventEmitter();
  @Output()
  public onSearch: EventEmitter<string> = new EventEmitter();
  @Output()
  public onReset: EventEmitter<string> = new EventEmitter();
}

@Component({
  selector: 'app-auto-complete-async-wrapper',
  template: `
    <app-auto-complete
      class="d-flex w-100"
      [group]="group"
      [controlName]="field.key"
      [label]="field?.templateOptions?.label"
      [cssClassName]="field?.templateOptions?.cssClassName"
      [inputStyle]="field?.templateOptions?.inputStyle"
      [placeholder]="field?.templateOptions?.placeholder"
      [attributes]="field?.templateOptions?.attributes"
      (onSelectItem)="field?.templateOptions?.events?.onSelectItem.emit($event)"
      (onSearch)="field?.templateOptions?.events?.onSearch.emit($event)"
      (onReset)="field?.templateOptions?.events?.onReset.emit($event)"
      [data]="data$"
      [showSpinner]="isLoading$ | async"
      [asyncQuery]="true"
      [searchKey]="field?.extraOptions?.searchKey"
      [debounceTime]="field?.extraOptions?.debounceTime"
      [minLength]="field?.extraOptions?.minLength"
      [spinnerColor]="field?.extraOptions?.spinnerColor"
      [spinnerSize]="field?.extraOptions?.spinnerSize || 20"
    ></app-auto-complete>
  `,
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteAsyncWrapperComponent implements OnInit {
  @Input()
  public field: NgxFormControl;
  @Input()
  public group: FormControl;

  @Output()
  public onSelectItem: EventEmitter<void> = new EventEmitter();
  @Output()
  public onSearch: EventEmitter<string> = new EventEmitter();
  @Output()
  public onReset: EventEmitter<string> = new EventEmitter();

  private facade: TypeProvider;
  public data$: Observable<any>;
  public isLoading$: Observable<boolean>;

  constructor(private injector: Injector) {}

  public ngOnInit() {
    if (this.field && this.field.extraOptions && this.field.extraOptions.asyncData) {
      const { provider, dataSelectorName, loadingSelectorName } = this.field.extraOptions.asyncData;
      this.facade = this.injector.get(provider);
      // data$ observable will be handled in autocomplete directive
      this.data$ = this.facade[dataSelectorName];
      this.isLoading$ = this.facade[loadingSelectorName];
    } else {
      throw new Error('Async autocomplete require extraOptions async parameters');
    }
  }
}

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent extends BaseInput implements OnInit {
  constructor() {
    super();
    this.debounceTime = 300;
    this.minLength = 2;
    this.spinnerColor = 'primary';
    this.showSpinner = false;
    this.spinnerSize = 20;
  }

  @Input('data') public items: any;
  @Input() public searchKey: string = 'key';
  @Input() public minLength: number;
  @Input() public asyncQuery: boolean;
  @Input() public spinnerColor: string;
  @Input() public spinnerSize: number;
  @Input() public showSpinner: boolean;

  @Output() public onSelectItem: EventEmitter<void> = new EventEmitter();
  @Output() public onSearch: EventEmitter<string> = new EventEmitter();
  @Output() public onReset: EventEmitter<string> = new EventEmitter();

  public filteredItems: any;

  public get data(): Observable<any[]> {
    return this.items instanceof Observable ? this.items : of(this.items);
  }

  public ngOnInit(): void {
    this.filteredItems = this.data;
    if (this.group) {
      this.control = this.group.get(this.controlName) as FormControl;
    }
  }

  public resetControl(): void {
    this.showSpinner = false;
    if (this.control.value === null || !this.control.value.toString().length) {
      this.onReset.emit();
      this.filteredItems = this.data;
    }
  }

  public handleSelectItem(event: MatAutocompleteSelectedEvent): void {
    this.showSpinner = false;
    const item: any = event.option.value;
    this.control.setValue(item[this.searchKey], { emitEvent: false });
    this.onSelectItem.emit(item);
  }

  public handleSearch(value: string): void {
    if (this.asyncQuery) {
      this.onSearch.emit(value);
    } else {
      this.filteredItems = this.filterItems(value);
    }
  }

  private doFilter(data: any[], value: string): Observable<any[]> {
    return of(
      data.filter(item => item[this.searchKey].toLowerCase().indexOf(value.toLowerCase()) === 0)
    );
  }

  private filterItems(value: string): Observable<any[]> {
    if (this.items instanceof Observable) {
      return this.items.pipe(switchMap(data => this.doFilter(data, value)));
    }
    return this.doFilter(this.items, value);
  }
}
