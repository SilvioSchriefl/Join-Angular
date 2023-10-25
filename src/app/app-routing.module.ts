import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MainComponent } from './main/main.component';
import { RouteGuardService } from './route-guard.service';
import { SummaryComponent } from './summary/summary.component';
import { ContactsComponent } from './contacts/contacts.component';

const routes: Routes = [
  {path: '', component:StartScreenComponent, children :[
    {path: 'login', component:LoginComponent},
    {path:'sign_up', component:SignUpComponent}
  ]},
  {path:'main', component:MainComponent,  canActivate: [RouteGuardService], children : [
    {path:'summary', component:SummaryComponent},
    {path:'contacts', component:ContactsComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
