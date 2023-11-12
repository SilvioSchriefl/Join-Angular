import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MainComponent } from './main/main.component';
import { RouteGuardService } from './route-guard.service';
import { SummaryComponent } from './summary/summary.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { HelpViewComponent } from './help-view/help-view.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PolicyComponent } from './policy/policy.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';

const routes: Routes = [
  
  {path: '', component:StartScreenComponent, children :[
    {path: 'restore_pw', component:RestorePasswordComponent},
    {path: 'login', component:LoginComponent},
    {path:'sign_up', component:SignUpComponent},
    {path:'private_policy', component:PolicyComponent},
    {path:'legal_notice', component:LegalNoticeComponent},
  ]},
  {path:'main', component:MainComponent,  canActivate: [RouteGuardService], children : [
    {path:'summary', component:SummaryComponent},
    {path:'contacts', component:ContactsComponent},
    {path:'add_task', component:AddTaskComponent},
    {path:'add_task_board', component:AddTaskComponent},
    {path:'board', component:BoardComponent},
    {path:'help', component:HelpViewComponent},
    {path:'legal_notice', component:LegalNoticeComponent},
    {path:'private_policy', component:PolicyComponent},
   
  ]},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
