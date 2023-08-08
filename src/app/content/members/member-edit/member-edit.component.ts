import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/common/_models/member';
import { User } from 'src/app/common/_models/user';
import { AccountService } from 'src/app/common/_services/account.service';
import { MembersService } from 'src/app/common/_services/members.service';


@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  introduction!: string;
  isVisible = false;
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | null = null;

  constructor(private accountService: AccountService, private memberService: MembersService,
    private toastr: ToastrService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      }
    })
  }
  setVisibility(status: boolean) {
    this.isVisible = status;
    if (status) {
      this.memberService.setVisible().subscribe({
        next: () => this.toastr.success('Set visibility successfully'),
        error: error => console.log('Failed to update visibility: ', error)
      });
    } else {
      this.memberService.setInvisible().subscribe({
        next: () => {
          this.toastr.success('Set invisibility successfully')
        },
        error: error => console.log('Failed to update visibility: ', error)
      });
    }
  }
  deleteAccount() {
    this.memberService.deleteAccount().subscribe({
      next: () =>{
        this.toastr.success('Account deleted successfully')
        this.router.navigateByUrl('/')
      },
      error: error => this.toastr.error('Failed to delete account: ', error)
    });
  }
}
