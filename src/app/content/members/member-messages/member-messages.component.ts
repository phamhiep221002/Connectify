import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/common/_models/message';
import { MessageService } from 'src/app/common/_services/message.service';
import { environment } from 'src/environments/environment';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm', { static: false }) messageForm?: NgForm;
  @Input() username?: string;
  messageContent = '';
  loading = false;
  loadingfile = false;
  loadinglocation = false;
  file64?: string;
  fileName?: string;
  mapURL?: string;
  zoomLevel: number = 14;
  private apiMapKey = environment.apiMapKey;
  selectedFile?: File;
  messages?: Message[];
  constructor(public messageService: MessageService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    
  }

  sendMessage() {
    if (!this.username) return;
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    }).finally(() => this.loading = false);
  }
  // New method to send file message
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = input.files[0].name;
    }
  }
  // New method to send location message
  async sendFileMessage() {
    if (!this.username || !this.selectedFile) return;

    this.loadingfile = true;
    try {
      await this.messageService.sendFileMessage(this.username, this.selectedFile);
      this.selectedFile = undefined;
      this.fileName = undefined;
      this.messageForm?.reset();
    } catch (error) {
      console.error("Failed to send file message:", error);
    } finally {
      this.loadingfile = false;
    }
  }
  async sendLocationMessage() {
    if (!this.username) return;
    this.loadinglocation = true;
    try {
      await this.messageService.createLocationMessage(this.username).then();
      this.messageForm?.reset();
    } catch (error) {
      console.error("Failed to send location message:", error);
    } finally {
      this.loadinglocation = false;
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
  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages?.splice(this.messages.findIndex(m => m.id === id), 1);
        this.cdr.detectChanges();
      }
    });
  }
  
}