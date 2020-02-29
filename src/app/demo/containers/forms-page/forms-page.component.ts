import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormsFacade } from '@app/shared/forms/+store/forms.facade';

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrls: ['./forms-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsPageComponent {
  constructor(private formsFacade: FormsFacade) {}
}
