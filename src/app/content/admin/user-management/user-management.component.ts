import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../modals/roles-modal/roles-modal.component';
import { AdminService } from 'src/app/common/_services/admin.service';
import { User } from 'src/app/common/_models/user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ]

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => {
        this.users = users;
      }
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }
  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
  blockUser(username: string) {
    this.adminService.blockUser(username).subscribe({
      next: () => {
        const user = this.users.find(x => x.username === username);
        if (user) {
          user.isBlocked = true;
        }
      },
      error: (err) => {
        console.error(`Failed to block user ${username}`, err);
      }
    });
  }
  unblockUser(username: string) {
    this.adminService.unblockUser(username).subscribe({
      next: () => {
        const user = this.users.find(x => x.username === username);
        if (user) {
          user.isBlocked = false;
        }
      },
      error: (err) => {
        console.error(`Failed to unblock user ${username}`, err);
      }
    });
  }
  isAdmin(user: User) {
    return user.roles.includes('Admin');
  }
}