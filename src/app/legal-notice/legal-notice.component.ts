import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from '../global-functions.service';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.sass']
})
export class LegalNoticeComponent {

  constructor(
    public router: Router,
    public globalService: GlobalFunctionsService
    ) {
    
  }
}
