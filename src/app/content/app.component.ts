import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from '../common/_services/account.service';
import { LocationService } from '../common/_services/location.service';
import { User } from '../common/_models/user';


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

  constructor (private accountService: AccountService ){}

  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user); 
  }
}
