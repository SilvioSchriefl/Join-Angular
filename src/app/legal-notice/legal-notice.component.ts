import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.sass']
})
export class LegalNoticeComponent {

  constructor(public router: Router,) {
    
  }
}
