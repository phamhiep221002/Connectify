import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/common/_models/member';
import { Pagination } from 'src/app/common/_models/pagination';
import { MembersService } from 'src/app/common/_services/members.service';

@Component({
  selector: 'app-member-connected',
  templateUrl: './member-connected.component.html',
  styleUrls: ['./member-connected.component.css']
})
export class MemberConnectedComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'connected';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadConnected();
  }
  loadConnected() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadConnected();
    }
  }
}
