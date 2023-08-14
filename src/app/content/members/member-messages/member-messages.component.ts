import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/common/_services/message.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm
  @Input() username?: string;
  messageContent = '';
  loading = false;
  file64?: string;
  fileName?: string;

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (!this.username) return;
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    }).finally(() => this.loading = false);
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // The result includes a MIME type prefix. We'll split it to get only the base64 data.
        this.file64 = (reader.result as string).split(',')[1];
      };
    }
  }
  // New method to send file message
  async sendFileMessage() {
    if (!this.username || !this.file64 || !this.fileName) return;
    this.loading = true;
    try {
        await this.messageService.createFileMessage(this.username, this.fileName, this.file64).then();
        // Handle successful message send, for example, reset form or show notification
        this.file64 = undefined;
        this.fileName = undefined;
    } catch (error) {
        console.error("Failed to send file message:", error);
    } finally {
        this.loading = false;
    }
}
  // New method to send location message
  async sendLocationMessage() {
    if (!this.username) return;
    this.loading = true;
    try {
      await this.messageService.createLocationMessage(this.username).then();
      this.messageForm?.reset();
      // Handle successful message send, for example, show notification
    } catch (error) {
      console.error("Failed to send location message:", error);
    } finally {
      this.loading = false;
    }
  }
}