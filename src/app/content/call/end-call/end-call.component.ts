import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/common/_models/user';
import { AccountService } from 'src/app/common/_services/account.service';

@Component({
  selector: 'app-end-call',
  templateUrl: './end-call.component.html',
  styleUrls: ['./end-call.component.css']
})
export class EndCallComponent {

  currentUser!: User;
  constructor(private route: ActivatedRoute, private accountService: AccountService) {
   this.accountService.currentUser$.subscribe(user => {
    if (user) {
      this.currentUser = user;
    }
  });
}
  onClick() {
    window.close();
  }
}
