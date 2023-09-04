import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemberUpdateDto } from 'src/app/common/_models/memberUpdateDto';
import { MembersService } from 'src/app/common/_services/members.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  memberUpdateInfo: MemberUpdateDto | undefined;
  @Output() interestAdded = new EventEmitter<void>();
  genders: any[] = []
  updatedSuccessfully: boolean = false;
  constructor(private membersService: MembersService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.loadMemberUpdateInfo();
    this.membersService.getGender().subscribe(
      response => {
        this.genders = response;
      },
      error => {
        console.log(error);
      }
    );
  }
  loadMemberUpdateInfo() {
    this.membersService.getUserForUpdate().subscribe(
      (response: MemberUpdateDto) => {
        this.memberUpdateInfo = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onUpdateUser() {
    if (this.memberUpdateInfo) {
      this.membersService.updateUser(this.memberUpdateInfo).subscribe(
        (response) => {
          // Cập nhật thành công
          this.updatedSuccessfully = true;
          this.toastr.success('Update succesfully!', response);
          this.interestAdded.emit();
        },
        (error) => {
          // Xử lý lỗi
          console.error('Lỗi khi cập nhật thông tin thành viên:', error);
        }
      );
    }
  }
}
