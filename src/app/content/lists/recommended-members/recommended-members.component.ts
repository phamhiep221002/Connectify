import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/common/_models/member';
import { Pagination } from 'src/app/common/_models/pagination';
import { UserParams } from 'src/app/common/_models/userParams';
import { MembersService } from 'src/app/common/_services/members.service';

@Component({
  selector: 'app-recommended-members',
  templateUrl: './recommended-members.component.html',
  styleUrls: ['./recommended-members.component.css']
})
export class RecommendedMembersComponent implements OnInit {
  members: Member[] | undefined;
  pageNumber = 1;
  pageSize = 5;
  userParams!: UserParams;
  pagination: Pagination | undefined;

  constructor(private membersService: MembersService) {}

  ngOnInit(): void {
    this.loadRecommendedMembers();
  }
  
  loadRecommendedMembers() {
    this.membersService.getRecommendedMembers(this.userParams, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }
  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadRecommendedMembers();
    }
  }
}
