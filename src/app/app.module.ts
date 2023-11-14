import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InterceptorService } from './interceptor.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { SummaryComponent } from './summary/summary.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PopupsComponent } from './popups/popups.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HelpViewComponent } from './help-view/help-view.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PolicyComponent } from './policy/policy.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { MoveToComponent } from './move-to/move-to.component';


@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    LoginComponent,
    SignUpComponent,
    MainComponent,
    SidebarComponent,
    HeaderComponent,
    SummaryComponent,
    ContactsComponent,
    PopupsComponent,
    AddTaskComponent,
    BoardComponent,
    HelpViewComponent,
    LegalNoticeComponent,
    PolicyComponent,
    RestorePasswordComponent,
    MoveToComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCheckboxModule,
    DragDropModule

  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
