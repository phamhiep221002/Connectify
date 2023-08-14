import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/common/_services/message.service';
import { environment } from 'src/environments/environment';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  messageContent = '';
  loading = false;
  file64?: string;
  fileName?: string;
  mapURL?: string;
  zoomLevel: number = 14;
  private apiMapKey = environment.apiMapKey;
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
    } catch (error) {
      console.error("Failed to send location message:", error);
    } finally {
      this.loading = false;
    }
  }
  getMapUrl(latitude: string, longitude: string): string {
    const apiKey = this.apiMapKey;
    const markerSize = this.calculateMarkerSize(this.zoomLevel);
    return `https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=${apiKey}&lat=${latitude}&lon=${longitude}&z=${this.zoomLevel}&poi=${latitude},${longitude}&poisize=${markerSize}&w=600&h=400&ppi=320&poithm=2`;
  }
  increaseZoom() {
    if (this.zoomLevel < 20) this.zoomLevel++;
  }

  decreaseZoom() {
    if (this.zoomLevel > 0) this.zoomLevel--;
  }
  calculateMarkerSize(zoomLevel: number): number {
    const minZoom = 0;
    const maxZoom = 20;

    const minSize = 10;
    const maxSize = 50;

    return minSize + (maxSize - minSize) * (zoomLevel - minZoom) / (maxZoom - minZoom);
  }
}