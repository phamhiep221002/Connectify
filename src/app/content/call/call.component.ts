import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Peer from 'peerjs';
import { CreateCallDto } from 'src/app/common/_models/call';
import { Member } from 'src/app/common/_models/member';
import { User } from 'src/app/common/_models/user';
import { AccountService } from 'src/app/common/_services/account.service';
import { CallService } from 'src/app/common/_services/call.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent implements OnInit {
  member: Member = {} as Member;
  currentUser!: User;
  myPeer: any;
  peerId: string = ''; // Người dùng muốn gọi
  stream: MediaStream | undefined;
  otherUserStream: MediaStream | undefined;
  enableVideo = true;
  enableAudio = true;
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  showIncomingCallButtons: boolean = false;

  constructor(private accountService: AccountService, private callService: CallService, private route: ActivatedRoute) {
    this.accountService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.route.params.subscribe(params => {
      const usernameToCall = params['username'];
      if (usernameToCall) {
        // Cập nhật logic kết nối hoặc gọi ở đây với `usernameToCall`
        this.callService.createHubConnection(this.currentUser, usernameToCall);
      }
      if (usernameToCall) {
        this.peerId = usernameToCall;
      }
    });
    this.callService.incomingCall$.subscribe(incoming => {
      this.showIncomingCallButtons = incoming;
    });
  }

  ngOnInit(): void {
    this.myPeer = new Peer(this.currentUser.username, {
      config: {
        'iceServers': [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "webrtc@live.com",
            credential: "muazkh"
          }
        ]
      }
    });
    this.myPeer.on('open', (id: string) => {
      this.peerId = id; // Lấy ID của người dùng hiện tại
      console.log("My Peer ID:", id);
    });
    this.createLocalStream();
    this.handleIncomingCalls();
  }

  async createLocalStream() {
    try {
      if (this.enableVideo) {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: this.enableAudio });
      } else {
        this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: this.enableAudio });
      }
      // Thêm kiểm tra null trước khi gán cho localVideo.nativeElement.srcObject
      if (this.localVideo) {
        this.localVideo.nativeElement.srcObject = this.stream;
        this.localVideo.nativeElement.load();
        this.localVideo.nativeElement.play();
      }
    } catch (error) {
      console.error("Error getting user media:", error);
    }
  }

  enableOrDisableVideo() {
    this.enableVideo = !this.enableVideo;
    if (this.stream && this.stream.getVideoTracks().length > 0) {
      this.stream.getVideoTracks()[0].enabled = this.enableVideo;
    }
  }

  enableOrDisableAudio() {
    this.enableAudio = !this.enableAudio;
    if (this.stream && this.stream.getAudioTracks().length > 0) {
      this.stream.getAudioTracks()[0].enabled = this.enableAudio;
    }
  }

  callUser() {
    debugger
    if (this.myPeer && this.peerId) {
      const call = this.myPeer.call(this.peerId, this.stream);
      call.on('stream', (userVideoStream: MediaStream) => {
        this.otherUserStream = userVideoStream;
        this.remoteVideo.nativeElement.srcObject = userVideoStream;
        this.remoteVideo.nativeElement.load();
        this.remoteVideo.nativeElement.play();
      });
    } else {
      console.error("My Peer object or peer ID is null.");
    }
  }

  handleIncomingCalls() {
    this.myPeer.on('call', (call: any) => {
      call.answer(this.stream);
      call.on('stream', (userVideoStream: MediaStream) => {
        this.otherUserStream = userVideoStream;
        this.remoteVideo.nativeElement.srcObject = userVideoStream;
        this.remoteVideo.nativeElement.load();
        this.remoteVideo.nativeElement.play();
      });
    });
  }
  shareScreen() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    this.enableVideo = false; // Tắt video để chia sẻ màn hình
    this.createLocalStream();
  }
  endCall() {
    if (this.myPeer) {
      this.myPeer.destroy(); // Ngắt kết nối PeerJS
      this.callService.stopHubConnection(); // Ngắt kết nối SignalR
    }
    window.close(); // Đóng tab
  }
  acceptIncomingCall() {
    const createCallDto: CreateCallDto = {
      recipientUsername: this.currentUser.username,
      callerUsername: 'todd',
      isVoiceEnabled: true, // giá trị tuỳ chỉnh
      isVideoEnabled: false, // giá trị tuỳ chỉnh
      isScreenSharingEnabled: false // giá trị tuỳ chỉnh
    };
    this.callService.acceptCall(createCallDto)
    this.showIncomingCallButtons = false;
    this.ngOnInit();
  }

  denyIncomingCall() {
    // Có thể thêm logic để gửi thông báo "Deny" tới server nếu cần
    this.showIncomingCallButtons = false;
  }


}
