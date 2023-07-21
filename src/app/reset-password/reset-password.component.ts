import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  token!: string;
  newPassword!: string;
  confirmPassword!: string;
  message!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  async onSubmit() {
    this.message = ''; // Reset the message before making a new request
    try {
      await this.accountService.resetPassword(this.token, this.newPassword);
      this.message = 'Password reset successfully. Please login again.';
    } catch (error: any) {
      this.message = 'Error: ' + error.message; // Handle error messages from the server
    }
  }
}
