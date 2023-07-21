import { Component } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  async onSubmit() {
    this.message = ''; // Reset the message before making a new request
    try {
      await this.accountService.forgotPassword(this.email);
      this.message = 'Password reset link sent to your email.';
      this.toastr.success(this.message, 'Success'); // Show success message
    } catch (error: any) {
      this.message = 'Error: ' + error.message;
      this.toastr.error(this.message, 'Error'); // Show error message
    }
  }
}
