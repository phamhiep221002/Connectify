import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InterestsDto } from 'src/app/common/_models/interestsDto';
import { LookingForsDto } from 'src/app/common/_models/lookingForsDto';
import { Member } from 'src/app/common/_models/member';
import { User } from 'src/app/common/_models/user';
import { AdminService } from 'src/app/common/_services/admin.service';
import { MembersService } from 'src/app/common/_services/members.service';
@Component({
  selector: 'app-edit-lookingfor',
  templateUrl: './edit-lookingfor.component.html',
  styleUrls: ['./edit-lookingfor.component.css']
})
export class EditLookingforComponent implements OnInit {
  @Output() interestAdded = new EventEmitter<void>();
  lookingFors: LookingForsDto[] = [];
  searchlookingForm!: FormGroup;
  user: User | null = null;
  member: Member | undefined;
  isVisible = false;
  interests: InterestsDto[] = []

  constructor(
    private memberService: MembersService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.initializeSearchFormLookingFor();
  }
  initializeSearchFormLookingFor() {
    this.searchlookingForm = this.fb.group({
      name: ['']
    });
  }

  onSearchLookingFor() {
    const searchValue = this.searchlookingForm.get('name')!.value;
    if (searchValue.trim() === '') {
      this.toastr.error('Please fill in the information');
      return;
    }
    this.loadLookingFors(searchValue);
  }
  loadLookingFors(name?: string) {
    this.adminService.getLookingFors(name).subscribe(response => {
      this.lookingFors = response;
    }, error => {
    });
  }
  addLookingFor(id: number) {
    this.memberService.addLookingFor(id).subscribe(response => {
      this.toastr.success('Looking for added successfully');
      this.interestAdded.emit();
    }, error => {
    });
  }

 
  isLookingForAdded(lookingForId: number): boolean {
    if (!this.member || !this.member.lookingFors) {
      return false;
    }
    return this.member.lookingFors.some(lf => lf.id === lookingForId);
  }
}
