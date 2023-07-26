import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationDto } from 'src/app/_models/locationDto';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { LocationService } from 'src/app/_services/location.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  genders: any[] = [];
  

  constructor(private memberService: MembersService, private locationService: LocationService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
    this.memberService.getGender().subscribe(
      (response) => {
        this.genders = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      });
    }
  }
  loadAllMembers() {
    this.userParams!.minAge = 18;   // or whatever your minimum age is
    this.userParams!.maxAge = 99;   // or whatever your maximum age is
    this.userParams!.gender = '';   // reset the gender filter
    this.userParams!.orderBy = '';  // reset the order
    this.loadMembers();            // now load all members
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
