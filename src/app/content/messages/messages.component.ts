import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private messageService: MessageService,public accountService: AccountService ) { }

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

}
