import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { LocationService } from './_services/location.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Connectify';
  cityName!: string;
  latitude: number | undefined;
  longitude: number | undefined;
  foundCity: string | undefined;
  accessDenied: boolean = false;
  isLoggedIn = false;
  isLocationAllowed = false;

  constructor (private accountService: AccountService, private toastr: ToastrService, private router: Router ){}

  ngOnInit(): void {
    this.setCurrentUser();
    this.getLocation();
  }
  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user); 
  }
  getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            this.accessDenied = false;
            resolve(position);
          },
          (error: GeolocationPositionError) => {
            this.accessDenied = true;
            this.toastr.error('Please allow location access to use the app.', 'Location Access Denied');
            reject(error);
          }
        );
      } else {
        this.accessDenied = true;
        reject('Geolocation is not available in this browser.');
      }
    });
  }
}
