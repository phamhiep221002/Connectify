import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  updateIntroForm!: FormGroup;
  modalRef!: BsModalRef;
  isVisible = false;
  member: Member | undefined;
  user: User | null = null;

  constructor(private accountService: AccountService, private memberService: MembersService,
    private toastr: ToastrService, private router: Router, private fb: FormBuilder, private modalService: BsModalService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
    this.updateIntroForm = this.fb.group({
      introduction: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => {
        this.member = member
        this.isVisible = member.isVisible;
      }
    })
  }
  setVisibility(status: boolean) {
    this.isVisible = status;
    if (status) {
      this.memberService.setVisible().subscribe({
        next: () => {
          this.toastr.success('Set visibility successfully')
          this.loadMember();
        },
        error: error => console.log('Failed to update visibility: ', error)
      });
    } else {
      this.memberService.setInvisible().subscribe({
        next: () => {
          this.toastr.success('Set invisibility successfully')
          this.loadMember();
        },
        error: error => console.log('Failed to update visibility: ', error)
      });
    }
  }
  deleteAccount() {
    if (confirm('Are you sure to disable your account?')) {
      this.memberService.deleteAccount()
      this.accountService.logout();
      this.router.navigate(['/']);
      this.toastr.success('Account is disable successfully')
    }
  }
  updateIntroduction() {
    if (!this.member) {
      return;
    }
    if (this.updateIntroForm.valid && this.updateIntroForm.dirty) {
      this.member.introduction = this.updateIntroForm.value.introduction;
    }
    this.memberService.updateUserIntroduction(this.member).subscribe({
      next: () => {
        this.toastr.success('Introduction updated successfully');
        this.updateIntroForm.reset(this.updateIntroForm.value);
        this.modalRef.hide();
      },
      error: error => {
        this.toastr.error(error);
      }
    })
  }
  openModal(template: TemplateRef<any>) {
    if (!this.member) {
      return;
    }
    this.updateIntroForm.setValue({
      introduction: this.member.introduction
    });
    this.modalRef = this.modalService.show(template);
  }
}
