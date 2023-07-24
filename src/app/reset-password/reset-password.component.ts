import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Location } from '@angular/common';
import { ResetPasswordDto } from '../_models/resetPasswordDto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  newPassword!: string;
  confirmPassword!: string;
  message!: string;
  submitted: boolean = false;
  email!: string;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const currentURL = this.location.path();
      // Tách thông tin email và token
      const emailTokenArr = currentURL.split("/reset-password/email")[1].split("&token");
      this.email = decodeURIComponent(emailTokenArr[0]);
      this.token = emailTokenArr[1];
    });
  }
  param: ResetPasswordDto = <ResetPasswordDto>{};
  async onSubmit() {
    this.message = '';
    this.param.email = this.email
    this.param.token = this.token
    this.param.newPassword = this.newPassword
    try {
      await this.accountService.resetPassword(this.param);
      this.submitted=true;
      this.message = 'Password reset successfully. Please login again.';
      this.toastr.success(this.message, 'Success');
    } catch (err: any) {
    }
  }
}
