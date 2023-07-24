import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Location } from '@angular/common';
import { ResetPasswordDto } from '../_models/resetPasswordDto';

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
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const currentURL = this.location.path();        
      // Tách thông tin email và token
      const emailTokenArr = currentURL.split("/reset-password/email")[1].split("&token");
      this.email = decodeURIComponent(emailTokenArr[0]);
      this.token = emailTokenArr[1];
    });
  }

 param: ResetPasswordDto = <ResetPasswordDto>{
  };
  onSubmit() {
    this.message = '';
    this.param.email = "donmqpk00888@gmail.com"
    this.param.token = "abc"
    this.param.newPassword = this.newPassword
    this.accountService.resetPassword(this.param).subscribe({
      next: (result:any) => {
        if (result.isSuccess) {
          this.message = 'Password reset successfully. Please login again.';
        }
      },
      error: (err: any) => this.message = 'Error: ' + err.message // Handle error messages from the server
    })
  }
}
