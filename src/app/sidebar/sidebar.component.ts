import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  sidebarActive: boolean = false;

  constructor(public accountService: AccountService, private router: Router, 
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }
}
