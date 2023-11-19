import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from '../global-functions.service';

@Component({
  selector: 'app-help-view',
  templateUrl: './help-view.component.html',
  styleUrls: ['./help-view.component.sass']
})
export class HelpViewComponent {

  constructor(
    public router: Router,
    public globalService: GlobalFunctionsService
  ) {}

}
