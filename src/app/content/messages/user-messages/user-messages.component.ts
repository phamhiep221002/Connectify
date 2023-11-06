import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ConnectedMessage } from 'src/app/common/_models/connectedMessage';
import { Member } from 'src/app/common/_models/member';
import { Message } from 'src/app/common/_models/message';
import { Pagination } from 'src/app/common/_models/pagination';
import { User } from 'src/app/common/_models/user';
import { AccountService } from 'src/app/common/_services/account.service';
import { MembersService } from 'src/app/common/_services/members.service';
import { MessageService } from 'src/app/common/_services/message.service';
import { PresenceService } from 'src/app/common/_services/presence.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.css']
})
export class UserMessagesComponent implements OnInit, OnDestroy {
  username?: string;
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
  member: Member = {} as Member;
  callUrl = environment.callUrl;
  isMessageNavBoxVisible: boolean = false;
  isMessageMenuVisible: boolean = false;
  isEmojiMenuVisible: boolean = false;
  isChatinputMoreMenuVisible: boolean = false;
  isMessageBoxVisible = false;
  timeoutId: any;
  user!: User;
  connectedMessage?: ConnectedMessage[];
  pagination?: Pagination;
  pageNumber = 1;
  pageSize = 5;
  predicate = 'connected';
  members: Member[] | undefined;
  search = '';
  fullName = '';
  constructor(public messageService: MessageService, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    public presenceService: PresenceService, private memberService: MembersService, private accountService: AccountService, private router: Router) {
    this.messageService.messageThread$.subscribe(
      messages => {
        this.messages = messages;
        this.loadAllMessages();
      }
    );
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
      }
    })
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.username = username;
      }
    });
  }
  ngOnDestroy() {
    this.messageService.stopHubConnection();
  }
  ngOnInit() {
    this.messageService.createHubConnection(this.user, this.member.userName);
    this.loadLikes();
    console.log(this.username)
  }
  loadAllMessages() {
    this.loading = true;
    this.messageService.getconnectedMessages(this.pageNumber, this.pageSize, this.fullName).subscribe({
      next: response => {
        this.connectedMessage = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      }
    })
  }
  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize, this.search).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = input.files[0].name;
      this.sendCombinedMessage();
      this.messageContent = '';
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
      if (this.messageContent.trim() === '') return;
      this.loading = true;
      try {
        await this.messageService.sendMessage(this.username, this.messageContent);
        this.messageContent = '';
      } catch (error) {
        console.error("Failed to send text message:", error);
      } finally {
        this.loading = false;
      }
    }
    console.log(this.username);
  }

  async sendLocationMessage() {
    if (!this.username) return;
    this.loadinglocation = true;
    try {
      debugger
      await this.messageService.createLocationMessage(this.username).then();
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
  unsendMessage(id: number) {
    this.messageService.unsendMessage(id).subscribe({
      next: () => {
        // this.messages?.splice(this.messages.findIndex(m => m.id === id), 1);
        this.cdr.detectChanges();
      }
    });
  }

  callOpen() {
    window.open(this.callUrl + this.username, '_blank', 'height=600,width=800')
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