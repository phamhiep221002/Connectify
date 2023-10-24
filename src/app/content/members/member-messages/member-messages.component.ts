import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/common/_models/message';
import { MessageService } from 'src/app/common/_services/message.service';
import { environment } from 'src/environments/environment';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageForm', { static: false }) messageForm?: NgForm;
  @ViewChild('scrollMe', { static: false }) private myScrollContainer?: ElementRef;

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
  callUrl = environment.callUrl;
  expandedMessages: { [id: string]: boolean } = {};
  constructor(public messageService: MessageService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {
    this.messageService.messageThread$.subscribe(
      messages => {
        this.messages = messages;
      }
    );
  }
  ngAfterViewChecked(): void {

  }

  ngOnInit(): void {
    this.scrollToBottom();
  }
   scrollToBottom(): void {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer!.nativeElement.scrollHeight;
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = input.files[0].name;
    }
  }

  async sendCombinedMessage() {
    if (!this.username) return;

    if (this.selectedFile) {
      this.loadingfile = true;
      try {
        await this.messageService.sendFileMessage(this.username, this.selectedFile);
        this.selectedFile = undefined;
        this.fileName = undefined;
      } catch (error) {
        console.error("Failed to send file message:", error);
      } finally {
        this.loadingfile = false;
      }
    } else {
      this.loading = true;
      try {
        await this.messageService.sendMessage(this.username, this.messageContent);
      } catch (error) {
        console.error("Failed to send text message:", error);
      } finally {
        this.loading = false;
      }
    }
    this.messageForm?.reset();
  }

  toggleMessageExpansion(message: Message) {
    const id = message.id;
    this.expandedMessages[id] = !this.expandedMessages[id];
  }

  isDropdownVisible: boolean = false;


  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // New method to send location message
  async sendLocationMessage() {
    if (!this.username) return;
    this.loadinglocation = true;
    try {
      debugger
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
  callOpen() {
    window.open(this.callUrl + this.username, '_blank', 'height=600,width=800')
  }
}