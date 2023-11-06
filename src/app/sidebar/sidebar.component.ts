import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent {

  constructor(public route: Router) { }


  navigateTo(link: string) {
    this.route.navigateByUrl(`/main/${link}`);
  }

  openLegalNotice() {
    this.route.navigateByUrl('/main/legal_notice');
  }

  openPrivatePolicy() {
    this.route.navigateByUrl('/main/private_policy');
  }

}
