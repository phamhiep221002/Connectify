import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectedMessage } from 'src/app/common/_models/connectedMessage';
import { Member } from 'src/app/common/_models/member';
import { Message } from 'src/app/common/_models/message';
import { Pagination } from 'src/app/common/_models/pagination';
import { User } from 'src/app/common/_models/user';
import { AccountService } from 'src/app/common/_services/account.service';
import { MembersService } from 'src/app/common/_services/members.service';
import { MessageService } from 'src/app/common/_services/message.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages?: Message[];
  connectedMessage?: ConnectedMessage[];
  pagination?: Pagination;
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  member!: Member;
  users: User[] = [];
  userName: any;
  isMessageNavBoxVisible: boolean = false;
  isMessageMenuVisible: boolean = false;
  isEmojiMenuVisible: boolean = false;
  isChatinputMoreMenuVisible: boolean = false;
  isMessageBoxVisible = false;
  timeoutId: any;

  constructor(private messageService: MessageService, public accountService: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadAllMessages();
  }

  loadAllMessages() {
    this.loading = true;
    this.messageService.getconnectedMessages(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.connectedMessage = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.ngOnInit();
    }
  }



  toggleMessageBox(visible: boolean) {
    // Delete the timer when the box is hidden before
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (visible) {
      this.isMessageBoxVisible = true;
    } else {
      // box hidden, delay 1s
      this.timeoutId = setTimeout(() => {
        this.isMessageBoxVisible = false;
      }, 1000);  // Delay time
    }
  }

  toggleMessageNavBox() {
    this.isMessageNavBoxVisible = !this.isMessageNavBoxVisible;
  }

  toggleMessageMenu() {
    this.isMessageMenuVisible = !this.isMessageMenuVisible;
  }

  toggleEmojiMenu() {
    this.isEmojiMenuVisible = !this.isEmojiMenuVisible;
  }

  toggleChatinputMoreMenu() {
    this.isChatinputMoreMenuVisible = !this.isChatinputMoreMenuVisible;
  }

}
