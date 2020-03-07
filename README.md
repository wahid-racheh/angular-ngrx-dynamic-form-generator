# [angular-ngrx-dynamic-form-generator](https://github.com/wahid-racheh/angular-ngrx-dynamic-form-generator)

angular-ngrx-dynamic-form-generator is a dynamic (JSON powered) form library for Angular. It demonstrate a preconfigured application build with angular, ngrx, storybook and material framework that bring some features to manage your application's forms by providing a JSON configuration schema as an entry, and than render dynamically and recursively all your form elements.

[Live Demo](https://angular-ngrx-form-generator.netlify.com)

## Technical stack

- [Angular](https://github.com/angular/angular) (v9.0.1")
- [Angular material](https://v7.material.angular.io/) (v9.0.0)
- [Storybook](https://github.com/storybooks/storybook) (v5.3.13)
- [Jest](https://github.com/facebook/jest) (v24.9.0)

## System Requirements

- [Node](https://nodejs.org) v10.16.3 or greater
- [Npm](https://www.npmjs.com) v6.9.0 or greater
- [Sass](https://sass-lang.com/install) (which require ruby)

All of these must be available in your PATH. To verify things are set up properly, you can run this:

```sh
$ node --version
$ npm --version
```

## Requirement for sonar plugin

- [SonarQube](https://docs.sonarqube.org)
- [Java JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html) (v11+)

## Installation

Clone the repository : 

```sh
$ git clone https://github.com/wahid-racheh/angular-ngrx-dynamic-form-generator
```

Then go under project root directory and install the dependencies :

```sh
$ npm run setup
```

Once you have the dependencies installed, run the following command to start the demo application:

```sh
$ npm run start
```

## Usage

### 1. include the form module in the AppModule

You can copy the forms module from the demo app and then include it in your project : 

```ts
import { FormsModule as MyFormsModule } from 'path-to-forms-module';

@NgModule({
  imports: [
    CommonModule,
    MyFormsModule
  ],
  ...
})
export class AppModule { }
```

### 2. Rendering the form :

This is a simple example of configuring a form with a group of two fields.

```ts
@Component({
  selector: 'app',
  template: `
    <app-form [form]="form" 
      [formConfig$]="formConfig$"
      [data$]="data$"
      (onSubmit)="handleSubmit($event)"
      (onInitForm)="handleInitForm($event)"
      (onUpdateForm)="handleUpdateData($event)">

        <app-form-content
            [form]="form" 
            [controls]="[controls.username]"
            >
        </app-form-content>

    </app-form>
  `,
})
export class AppComponent {
  public data$: Observable<any> = this.formsFacade.data$;
  public formConfig$: Observable<NgxFormConfig> = this.formsFacade.formConfig$;

  public form: FormGroup;
  public formConfig: NgxFormConfig = new NgxFormConfig({
    controls: [
    {
        key: 'address',
        type: NgxFormControlType.GROUP,
        templateOptions: {
            displayOrder: 1
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
        }
      ]
     }
    ]
  });

  public get controls(): any {
    return this.formConfig.controlsMap || null;
  }

  constructor(private formsFacade: FormsFacade) {}

  public ngOnInit() {
    this.formsFacade.setFormConfig(this.formConfig);
  }

  public handleInitForm(form) {
    this.form = form;
  }

  public handleUpdateData(changes) {
    this.formsFacade.updateData(changes);
  }

  public handleSubmit({ valid, value }) {
    if (valid) {
      // Your code here
    }
  }

  public ngOnDestroy() {
    this.formsFacade.initializeForm();
  }
}
```

The `<app-form>` component is the main container of the form, which will initialize and build the form, it accept the following inputs:

* form: The form instance which allow to track model value and validation status
* formConfig$: The form configurations for building the form, it contains an array of controls and a map of controls.
* data$: The form value.
* onSubmit: OnSubmit event, will be triggered when we trigger on submit event.
* onInitForm: OnInit form event, will be triggered when the form is initialized .
* onUpdateForm: OnUpdateForm event, will be triggered when form value is changed.

The `<app-form-content>` component is the container of the form fragments or blocks, which will render form fields, it accept the following inputs:

* form: The form instance.
* controls: An array of fields

The `FormsFacade` is the form service that provide many functions to handle and manage the form.

### 3. Rendering dynamic/static fields

```ts
@Component({
  selector: 'app',
  template: `
    <app-form [form]="form" 
      [formConfig$]="formConfig$"
      [data$]="data$"
      (onSubmit)="handleSubmit($event)"
      (onInitForm)="handleInitForm($event)"
      (onUpdateForm)="handleUpdateData($event)">

        <!-- Dynamic content -->
        <app-form-content
            [form]="form" 
            [controls]="[controls.address]"
            >
        </app-form-content>

        <!-- A static control -->
        <app-text-input
            [group]="form.get(controls.address.key)"
            [controlName]="controls.suite.key"
            [label]="controls.suite.templateOptions.label"
            [placeholder]="controls.suite.templateOptions.placeholder"
        ></app-text-input>

    </app-form>
  `,
})
export class AppComponent {
    ...

  public formConfig: NgxFormConfig = new NgxFormConfig({
    controls: [
    {
        key: 'address',
        type: NgxFormControlType.GROUP,
        templateOptions: {
            displayOrder: 1
        },
        childrens: [
        {
            // This field will be rendered dynamically
            isDynamic: true,

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
            // This field will not be rendered dynamically,
            // We shoud add it manually in the dom
            isDynamic: false,

            key: 'suite',
            type: NgxFormControlType.TEXT,
            templateOptions: {
                displayOrder: 2,
                label: 'Apt. Number',
                placeholder: 'Apt. Number'
            },
            validators: [Validators.required]
        }
      ]
     }
    ]
  });
 
 ...

  public get controls(): any {
    return this.formConfig.controlsMap || null;
  }

...

}
```

### 4. Rendering custom components

Important: custom components should be imported in the entryComponents array of the module, otherwise they will not works.

```ts
@NgModule({
 ...
  entryComponents: [MyCustomComponent],
})
export class AppModule {}
```

This is an example of a form with a custom html template and a custom angular component.

```ts
// Our custom component
// This should be imported in the entryComponents of the module
@Component({
  selector: 'app-customer-address',
  template: `
  <div class="row" [formGroup]="group">
    <div class="col-md-3">
        <mat-form-field class="full-width-input">
        <input matInput placeholder="Street" formControlName="street" />
        <mat-error>
            <app-error-message [control]="group.get('street')"></app-error-message>
        </mat-error>
        </mat-form-field>
    </div>

    <div class="col-md-3">
        <mat-form-field class="full-width-input">
        <input matInput placeholder="Apt. Number" formControlName="suite" />
        <mat-error>
            <app-error-message [control]="group.get('suite')"></app-error-message>
        </mat-error>
        </mat-form-field>
    </div>
  </div>
  `,
  styleUrls: []
})
export class CustomerAddressComponent {
  @Input()
  public field: NgxFormGroup;
  @Input()
  public group: FormGroup;
}

// Our form container component
@Component({
  selector: 'app',
  template: `
    <app-form [form]="form" 
      [formConfig$]="formConfig$"
      [data$]="data$"
      (onSubmit)="handleSubmit($event)"
      (onInitForm)="handleInitForm($event)"
      (onUpdateForm)="handleUpdateData($event)">

        <!-- Dynamic content -->
        <app-form-content
            [form]="form" 
            [controls]="formConfig.controls"
            >
        </app-form-content>

    </app-form>
  `,
})
export class AppComponent {
    ...

  public formConfig: NgxFormConfig = new NgxFormConfig({
    controls: [
    {
        // This is our custom html template field
        key: 'myCustomTemplate',
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
            displayOrder: 1
        }
    },
    {
        // This is our custom angular component field
        key: 'address',
        type: NgxFormControlType.GROUP,
        isDynamic: true,

        // CustomerAddressComponent should be referenced by componentRef attribute
        componentRef: CustomerAddressComponent, 
        
        templateOptions: {
            displayOrder: 2
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
        }
      ]
     }
    ]
  });
...

}
```

### 5. Handling events

Important: A control event should be initialized and subscribed in the constructor of the component.

```ts

@Component({
  selector: 'app',
  template: `
    <app-form [form]="form" 
      [formConfig$]="formConfig$"
      [data$]="data$"
      (onSubmit)="handleSubmit($event)"
      (onInitForm)="handleInitForm($event)"
      (onUpdateForm)="handleUpdateData($event)">

        <app-form-content
            [form]="form" 
            [controls]="[controls.username]"
            >
        </app-form-content>

    </app-form>
  `,
})
export class AppComponent {
  ...

  public formConfig: NgxFormConfig = new NgxFormConfig({
    controls: [
        {
            key: 'username',
            type: NgxFormControlType.TEXT,
            templateOptions: {
                displayOrder: 1,
                label: 'Username',
                placeholder: 'Username',
                events: {
                  onChange: new EventEmitter()
                }
            }
        }
    ]
  });

  constructor(private formsFacade: FormsFacade) {

      // Subscribing on usename change event
      this.onUsernameChange.subscribe((changes: any) => this.handleUserNameChange(changes));
  }

  public get controls(): any {
    return this.formConfig.controlsMap || null;
  }

  private get onUsernameChange(): EventEmitter<any> {
    const {
      username: {
        templateOptions: {
          events: { onChange }
        }
      }
    } = this.controls;
    return onChange;
  }

  public handleUserNameChange(changes: any) {
    console.log('Username changes : ', changes)
  }

 ...
}
```

## Supported Form Controls :

1. Text input
2. Textarea
3. Number input
4. Date picker
5. Select
6. Checkbox Group
7. Radio Group
8. Autocomplete
9. Async Autocomplete
10. Form Group
11. From Array
12. Custom angular components
13. Custom html template

## Form control parameters

### Common parameters :

| Name | type | Description |
| --- | --- | --- |
| key | string | The key that will identify and link the field. |
| type | NgxFormControlType | The type of field to be rendered. |
| isDynamic | boolean | By default true. It determine if the field will be rendered dynamically by the form generator, otherwise it should be added manually in the html template. |
| className | string | A css class that will be applied to the form control. |
| htmlTemplate | string | This will render basic html content. |
| componentRef | Type<any> | This attribute represent an angular component to be rendered in the dom. |
| validators | any[] | Used to set validation rules for a particular field. |
| childrens | NgxAbstractFormControl[] | Array of form controls. it is used in a Group control or Array control to associate fields with the same parent control |
| templateOptions | NgxTemplateOptions | Options for the template. |
| extraOptions | NgxExtraOptions | Extra option for the field data/model. |

### TemplateOptions :

| Name | type | Description |
| --- | --- | --- |
| displayOrder | number | Used to sort fields in the form configurations and to render all form controls using a specific order. |
| disabled | boolean | Enable/disable input. |
| label | string | Control label. |
| placeholder | string | Control placeholder. |
| inputStyle | any | Control css style object. |
| cssClassName | string | Control css class name. |
| events | {[key: string]: any} | Object of event listener, onClick, onChange ... |
| attributes | {[key: string]: any} | Input custom attributes. |
| defaultValue | any | Control default value. |

### ExtraOptions :

#### 1. Date picker parameters

Date picker control require moment library: 

```ts
import moment from 'moment';
```

| Name | type | Description |
| --- | --- | --- |
| defaultValue | moment.Moment | Control default value. |
| minDate | moment.Moment | Min date for validation. |
| maxDate | moment.Moment | Max date for validation. |

#### 2. AutoComplete parameters

| Name | type | Description |
| --- | --- | --- |
| data | any | Array of data. |
| debounceTime | number | Debounce time for input value change. |
| minLength | number | Search term minimum length to make search. |
| spinnerSize | number | Spinner size, by default 20. |
| spinnerColor | string | Spinner color. |
| showSpinner | Observable<boolean> or boolean | Show or hide spinner. |

#### 3. Async AutoComplete parameters

Include the above autocomplete parameters and the following new parameters :

| Name | type | Description |
| --- | --- | --- |
| asynQuery | boolean | Should set to true when we use an async autoComplete . |
| asyncData | NgxAutoCompleteAsyncData | Should set asyncData only when we use an async autocomplete. |

#### 4. Select parameters

| Name | type | Description |
| --- | --- | --- |
| data | any | Select options. |
| selectedValue | any | Selected value. |
| optionKey | string | Option key name. |
| optionValue | string | Option value name. |

#### 5. Radio and checkbox parameters

| Name | type | Description |
| --- | --- | --- |
| data | any | Select options. |
| displayInline | boolean | Determine if element should be displayed inline or in multiple lines. |
| selectedValues | any[] | Selected values. |
| optionKey | string | Option key name. |
| optionValue | string | Option value name. |

#### Control events :

1. Common event
    - onChange

2. Text, number and textarea inputs extended events
    - onBlur
    - onFocus

3. Autocomplete extended events
    - onReset
    - onSelectItem
    - onSearch

## Basic input configuration

Text, number, textarea fields

```js
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
}
```

## Date picker configuration

```js
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
    defaultValue: moment().clone().subtract(2, 'years'),
    minDate: moment().clone().subtract(4, 'days'),
    maxDate: moment()
    }
}
```

## Select configuration

```js
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
        data: [
            {id: 1, name: 'test1'},
            {id: 2, name: 'test2'}
        ],
        selectedValue: 2,
        optionKey: 'name',
        optionValue: 'id'
    }
}
```

## Autocomplete configuration

```js
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
        data: [
            {id: 1, name: 'test1'},
            {id: 2, name: 'test2'}
        ],
        searchKey: 'name',
        debounceTime: 300,
        minLength: 2
    }
}
```

## Async Autocomplete configuration

```js
{
    key: 'asyncAutoCompleteWithApi',
    type: NgxFormControlType.ASYNC_AUTOCOMPLETE,
    templateOptions: {
        displayOrder: 0,
        label: 'Autocomplete With api call',
        placeholder: 'Autocomplete with api call',
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
            // These properties are tooked from the demo application
            provider: UserFacade, // user service
            dataSelectorName: 'userList$', // user list observable
            loadingSelectorName: 'isLoading$' // isLoading observable
        },
        searchKey: 'name',
        debounceTime: 300,
        minLength: 2
    }
}
```

## Radio group configuration

```js
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
        data: [
            {id: 1, name: 'test1'},
            {id: 2, name: 'test2'}
        ],
        selectedValues: [{id: 1, name: 'test1'}],
        optionKey: 'name',
        optionValue: 'id'
    }
}
```

## Checkbox group configuration

```js
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
        data: [
            {id: 1, name: 'test1'},
            {id: 2, name: 'test2'}
        ],
        selectedValues: [{id: 1, name: 'test1'}],
        optionKey: 'key',
        optionValue: 'value'
    }
}
```

## Custom html template configuration

```js
{
    key: 'customTemplate',
    type: NgxFormControlType.CUSTOM_TEMPLATE,
    htmlTemplate: `
    <div class="row">
        <div class="col-md-12">
            <h5>
                Custom html template title
            </h5>
        </div>
    </div>
    `,
    templateOptions: {
        displayOrder: 0
    }
}
```

## Custom component configuration

```js
{
    key: 'customGroup',
    type: NgxFormControlType.GROUP,
    componentRef: CustomComponent, // Reference for your custom angular component
    templateOptions: {
        displayOrder: 1
    },
    childrens: [
        {
        key: 'customField',
        type: NgxFormControlType.TEXT,
        templateOptions: {
            displayOrder: 1,
            label: 'Custom Field',
            placeholder: 'Custom Field'
        },
        validators: []
        }
    ]
}
```

## Groups configuration

```js
{
    key: 'myGroup',
    type: NgxFormControlType.GROUP,
    templateOptions: {
        displayOrder: 1
    },
    childrens: [
        // Your fields here
        // You can add nested groups and nested arrays
    ]
}
```

## Arrays configuration

```js
{
    key: 'myArray',
    type: NgxFormControlType.ARRAY,
    templateOptions: {
    displayOrder: 1
    },
    childrens: [
        // Your fields here
        // You can add nested groups and nested arrays
    ]
}
```

For more details on how this form generator works, please take a look at the [Angular Demo application](https://angular-ngrx-form-generator.netlify.com).