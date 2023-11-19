import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteGuardService } from '../route-guard.service';
import { GlobalFunctionsService } from '../global-functions.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.sass']
})
export class PolicyComponent {
  constructor(
    public router: Router,
    public globalService: GlobalFunctionsService
    ) {
    
  }
}
