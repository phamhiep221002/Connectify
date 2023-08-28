import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/common/_models/member';
import { Pagination } from 'src/app/common/_models/pagination';
import { UserParams } from 'src/app/common/_models/userParams';
import { MembersService } from 'src/app/common/_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;
  userParams!: UserParams;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
    this.loadRecommendedMembers();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }
  loadRecommendedMembers() {
    this.memberService.getRecommendedMembers(this.userParams, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.ngOnInit();
    }
  }
}