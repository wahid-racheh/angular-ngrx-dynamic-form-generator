import { sortBy } from 'lodash';

import { NgxAbstractFormControl } from '@app/shared/forms/interfaces/types';

export interface INgxFormConfig {
  controlsMap?: { [key: string]: NgxAbstractFormControl };
  controls: NgxAbstractFormControl[];
}

export class NgxFormConfig {
  public controlsMap: { [key: string]: NgxAbstractFormControl };
  public controls: NgxAbstractFormControl[];

  constructor(init?: INgxFormConfig) {
    this.controls = this.sortControls(init.controls);
    this.controlsMap = this.flatData(this.controls);
  }

  public sortData(data) {
    return sortBy(data, obj => obj.templateOptions.displayOrder);
  }

  public sortControls(controls: any[]) {
    controls.forEach((control: any) => {
      if (control.childrens) {
        control.childrens = [...this.sortData(control.childrens)];
      }
    });
    return [...this.sortData(controls)];
  }

  private flatData(data) {
    return data.reduce((acc: any, item: any) => {
      const obj: any = {};
      obj[item.key] = this.initItem(item);
      acc = { ...acc, ...obj };
      if (item.childrens) {
        const temp = this.flatData(item.childrens);
        acc = { ...acc, ...temp };
      }
      return acc;
    }, {});
  }

  private initItem(item: any) {
    if (!item.hasOwnProperty('isDynamic')) {
      item.isDynamic = true;
    }
    if (!item.hasOwnProperty('level')) {
      item.level = 0;
    }
    if (!item.templateOptions) {
      item.templateOptions = {};
    }
    if (!item.templateOptions.hasOwnProperty('displayOrder')) {
      item.templateOptions.displayOrder = 0;
    }
    return { ...item };
  }
}
