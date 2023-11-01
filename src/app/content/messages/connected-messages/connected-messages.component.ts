import { Component, OnInit } from '@angular/core';
import { ConnectedMessage } from 'src/app/common/_models/connectedMessage';
import { Pagination } from 'src/app/common/_models/pagination';
import { MessageService } from 'src/app/common/_services/message.service';

@Component({
  selector: 'app-connected-messages',
  templateUrl: './connected-messages.component.html',
  styleUrls: ['./connected-messages.component.css']
})
export class ConnectedMessagesComponent implements OnInit {
  connectedMessage?: ConnectedMessage[];
  pagination?: Pagination;
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  constructor(private messageService: MessageService) { }

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
}
