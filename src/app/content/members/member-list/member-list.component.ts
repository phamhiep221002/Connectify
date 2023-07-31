import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { Member } from 'src/app/common/_models/member';
import { Pagination } from 'src/app/common/_models/pagination';
import { UserParams } from 'src/app/common/_models/userParams';
import { MembersService } from 'src/app/common/_services/members.service';
import { LocationService } from 'src/app/common/_services/location.service';
import { LocationDto } from 'src/app/common/_models/locationDto';


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
  ageSliderOptions: Options = {
    floor: 18,
    ceil: 99
  };
  ageRangeSliderValue: number[] = [];
  
  distanceSliderOptions: Options = {
    floor: 0,
    ceil: 100
  };
  distanceSliderValue: number[] = [];
  constructor(
    private memberService: MembersService,
    public locationService: LocationService,
  ) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
    this.ageRangeSliderValue = [this.userParams!.minAge, this.userParams!.maxAge];
    this.distanceSliderValue =[this.userParams!.latitude, this.userParams!.longitude];;
    this.memberService.getGender().subscribe(
      (response) => {
        this.genders = response;
      },
      (error) => {
        console.log(error);
      }
    );
    this.locationService.checkLocation();
  }


  loadMembers() {
    if (this.userParams) {
      this.userParams.pageNumber = this.userParams.pageNumber ?? 1;
      this.userParams.pageSize = this.userParams.pageSize ?? 5;
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
    this.userParams?.latitude;
    this.userParams?.longitude;
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
