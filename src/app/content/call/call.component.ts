import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Peer from 'peerjs';
import { User } from 'src/app/common/_models/user';
import { AccountService } from 'src/app/common/_services/account.service';


@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent implements OnInit {
  currentUser!: User;
  myPeer: any;
  shareScreenPeer: any;
  stream: any;
  enableVideo = true;
  enableAudio = true;
  shareScreenStream: any;
  enableShareScreen = true;// enable or disable button sharescreen
  @ViewChild('videoPlayer') localvideoPlayer!: ElementRef;

  constructor(private accountService: AccountService) {
    this.accountService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    })
  }
  ngOnInit(): void {
    this.myPeer = new Peer(this.currentUser.username, {
      config: {
        'iceServers': [{
          urls: "stun:stun.l.google.com:19302",
        }, {
          urls: "turn:numb.viagenie.ca",
          username: "webrtc@live.com",
          credential: "muazkh"
        }]
      }
    });
    this.myPeer.on('open', (id: any) => {
      console.log(id);
    });
  }
  addVideoStream(remoteStream: any) {
    throw new Error('Method not implemented.');
  }


  async createLocalStream() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: this.enableVideo, audio: this.enableAudio });
      this.localvideoPlayer.nativeElement.srcObject = this.stream;
      this.localvideoPlayer.nativeElement.load();
      this.localvideoPlayer.nativeElement.play();
    } catch (error) {
      console.error(error);
    }
  }

  enableOrDisableVideo() {
    this.enableVideo = !this.enableVideo
    if (this.stream.getVideoTracks()[0]) {
      this.stream.getVideoTracks()[0].enabled = this.enableVideo;
    }
  }

  enableOrDisableAudio() {
    this.enableAudio = !this.enableAudio;
    if (this.stream.getAudioTracks()[0]) {
      this.stream.getAudioTracks()[0].enabled = this.enableAudio;
    }
  }
}
