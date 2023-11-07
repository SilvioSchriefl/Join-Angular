import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteGuardService } from '../route-guard.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.sass']
})
export class PolicyComponent {
  constructor(public router: Router,) {
    
  }

  goTosignUp() {
    this.router.navigateByUrl('sign_up');
  }
}
