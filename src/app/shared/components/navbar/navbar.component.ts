import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {
  @Input() public title: string;

  constructor(private router: Router) {}

  public go(): void {
    this.router.navigate(['/demo/forms'])
  }
}
