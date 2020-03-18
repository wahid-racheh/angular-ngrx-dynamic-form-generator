import { Component, Input } from '@angular/core';

import { RouterFacade } from '@app/core/services/router/+store/router.facade';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {
  @Input() public title: string;

  constructor(private routerFacade: RouterFacade) {}

  public go(): void {
    this.routerFacade.go({ path: ['/demo/forms'] });
  }
}
