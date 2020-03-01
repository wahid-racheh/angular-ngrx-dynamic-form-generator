import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TextInputComponent } from '@app/shared/forms/components/text-input/text-input.component';
import { NgxAbstractFormControl, NgxFormControlType } from '@app/shared/forms/interfaces/types';
import { AppMockModules } from '@tests/mocks/app-mock-modules';
import { timer } from 'rxjs';

@Component({
  selector: 'app-test-dynamic-field',
  template: `
    <ng-container appDynamicField [field]="field" [group]="group"></ng-container>
  `
})
export class TestDirectiveComponent implements OnInit {
  @Input() public field: NgxAbstractFormControl;
  @Input() public group: FormGroup;

  public setControl: EventEmitter<any> = new EventEmitter();
  public control: FormControl;

  public ngOnInit() {
    if (this.group) {
      this.setControl.emit(this.group.get(this.field.key) as FormControl);
    }
  }
}

describe('DynamicFieldDirective', () => {
  let component: TestDirectiveComponent;
  let fixture: ComponentFixture<TestDirectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMockModules],
      declarations: [TestDirectiveComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [TextInputComponent] }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create field', async () => {
    // Given.
    component.group = new FormGroup({
      email: new FormControl('')
    });
    component.field = {
      key: 'email',
      type: NgxFormControlType.TEXT,
      level: 1,
      templateOptions: {
        displayOrder: 0,
        label: 'email',
        placeholder: 'email'
      },
      validators: [Validators.required]
    };

    // When.
    fixture.detectChanges();

    await timer(400).toPromise();

    component.setControl.subscribe(value => {
      expect(component.control).toBeDefined();
    });
  });
});
