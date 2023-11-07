import { Component, Input, OnInit } from '@angular/core';
import { Term } from 'src/app/common/_models/term';
import { AdminService } from 'src/app/common/_services/admin.service';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  @Input() listId?: number;
  term: Term[] | undefined;
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.getAllTerm(this.listId!);
  }
  getAllTerm(listId: number) {
    this.adminService.getAllTerm(listId).subscribe(response => {
      this.term = response;
      console.log(this.term);
    });
  }

}
