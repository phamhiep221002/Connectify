import { NgModule } from "@angular/core";
import { HasRoleDirective } from "../common/_directives/has-role.directive";
import { DatePickerComponent } from "../common/_forms/date-picker/date-picker.component";
import { TextInputComponent } from "../common/_forms/text-input/text-input.component";
import { AdminPanelComponent } from "./admin/admin-panel/admin-panel.component";
import { ConfirmDialogComponent } from "./admin/modals/confirm-dialog/confirm-dialog.component";
import { RolesModalComponent } from "./admin/modals/roles-modal/roles-modal.component";
import { PhotoManagementComponent } from "./admin/photo-management/photo-management.component";
import { UserManagementComponent } from "./admin/user-management/user-management.component";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { ServerErrorComponent } from "./errors/server-error/server-error.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { HomeComponent } from "./home/home.component";
import { ListsComponent } from "./lists/lists.component";
import { LoginComponent } from "./login/login.component";
import { MemberCardComponent } from "./members/member-card/member-card.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MemberMessagesComponent } from "./members/member-messages/member-messages.component";
import { PhotoEditorComponent } from "./members/photo-editor/photo-editor.component";
import { MessagesComponent } from "./messages/messages.component";
import { NavComponent } from "./nav/nav.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxWebstorageModule } from "ngx-webstorage";
import { SharedModule } from "../common/_modules/shared.module";
import { ErrorInterceptor } from "../common/_interceptor/error.interceptor";
import { JwtInterceptor } from "../common/_interceptor/jwt.interceptor";
import { LoadingInterceptor } from "../common/_interceptors/loading.interceptor";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from "./app.component";
import { NgxSliderModule } from "ngx-slider-v2";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberDetailComponent,
    ListsComponent,
    MessagesComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TextInputComponent,
    DatePickerComponent,
    MemberMessagesComponent,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RolesModalComponent,
    ConfirmDialogComponent,
    SidebarComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MemberListComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxWebstorageModule.forRoot(),
    NgxSliderModule,
    RecaptchaV3Module
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
