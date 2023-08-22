import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/common/_models/member';
import { Message } from 'src/app/common/_models/message';
import { Pagination } from 'src/app/common/_models/pagination';
import { MembersService } from 'src/app/common/_services/members.service';
import { MessageService } from 'src/app/common/_services/message.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages?: Message[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  predicate = 'connected';
  members: Member[] | undefined;

  constructor(private messageService: MessageService, private memberService: MembersService ) { }

  ngOnInit(): void {
    // this.loadMessages();
  }

}





  // loadMessages() {
  //   this.loading = true;
  //   this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
  //     next: response => {
  //       this.messages = response.result;
  //       this.pagination = response.pagination;
  //       this.loading = false;
  //     }
  //   })
  // }

  // deleteMessage(id: number) {
  //   this.messageService.deleteMessage(id).subscribe({
  //     next: () => this.messages?.splice(this.messages.findIndex(m => m.id === id), 1)
  //   })
  // }

  // pageChanged(event: any) {
  //   if (this.pageNumber !== event.page) {
  //     this.pageNumber = event.page;
  //     this.loadMessages();
  //   }
  // }

