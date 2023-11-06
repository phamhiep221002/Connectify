import { Component, OnInit } from '@angular/core';
import { Terms } from 'src/app/common/_models/term';
import { AdminService } from 'src/app/common/_services/admin.service';

@Component({
  selector: 'app-term-management',
  templateUrl: './term-management.component.html',
  styleUrls: ['./term-management.component.css']
})
export class TermManagementComponent implements OnInit {
  termList: Terms[] | undefined;
  
    constructor(private adminService: AdminService) { }
  
    ngOnInit(): void {
     this.getAllTermList();
    }
    getAllTermList() {
    this.adminService.getAllTermList().subscribe(response => {
      this.termList = response;
      console.log(this.termList);
    });
  }
}
