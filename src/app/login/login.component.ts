import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../_services/location.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(public accountService: AccountService, private router: Router, 
    private toastr: ToastrService, private locationService: LocationService) { }

  ngOnInit(): void {
  }

  login() {
    
    if (!this.model.username || !this.model.password) {
      this.toastr.warning('Please enter username and password.', 'Notice');
      return;
    }
    // Thực hiện yêu cầu chia sẻ vị trí
    navigator.geolocation.getCurrentPosition(
      
      (position) => {
        // Nếu người dùng đồng ý chia sẻ vị trí, lưu thông tin vị trí vào localStorage
        localStorage.setItem('userLocation', JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        this.locationService.sendUserLocation(position.coords.latitude, position.coords.longitude)
        // Tiến hành đăng nhập
        this.accountService.login(this.model).subscribe({
          
          next: _ => {
            this.router.navigateByUrl('/members');
            this.model = {};
          },
          error: error => {
          }
        });
      },
      (error) => {
        // Nếu người dùng từ chối chia sẻ vị trí hoặc có lỗi xảy ra, hiển thị thông báo yêu cầu chia sẻ vị trí
        this.toastr.warning('Please allow location sharing to use website functionality.', 'Location sharing request');
      }
    );
  }
}
