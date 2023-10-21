import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { CreateCallDto, Room } from '../_models/call';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private callStatusSource = new BehaviorSubject<CreateCallDto[]>([]);
  callStatus$ = this.callStatusSource.asObservable();
  private incomingCallSource = new BehaviorSubject<boolean>(false);
  incomingCall$ = this.incomingCallSource.asObservable();
  microUpdate = new BehaviorSubject<boolean>(true);
  cameraUpdate = new BehaviorSubject<boolean>(true);
  screenUpdate = new EventEmitter<void>();

  constructor() { }

  createHubConnection(user: User, otherUsername: string) {
    // Tạo kết nối tới CallHub
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'call?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
        transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    // Bắt đầu kết nối
    this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(() => { });

    this.hubConnection.on('AcceptCall', () => {
      this.incomingCallSource.next(false);
    });

    this.hubConnection.on('MicroUpdate', () => {
    });

    this.hubConnection.on('CameraUpdate', () => {
    });

    this.hubConnection.on('ScreenUpdate', () => {
    });
    this.hubConnection.on('IncomingCall', () => {
      console.log("IncomingCall");
      this.incomingCallSource.next(true);
    });

    this.hubConnection.on('EndCall', (createCallDto: CreateCallDto) => {
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.callStatusSource.next([]);
      this.hubConnection.stop();
    }
  }
  acceptCall(createCallDto: CreateCallDto) {
    this.hubConnection?.invoke('AcceptCall', createCallDto)
      .catch(error => console.log(error));
  }

  updateMicrophone(createCallDto: CreateCallDto) {
    this.hubConnection?.invoke('Micro', createCallDto)
      .catch(error => console.log(error));
  }

  updateCamera(createCallDto: CreateCallDto) {
    this.hubConnection?.invoke('Camera', createCallDto)
      .catch(error => console.log(error));
  }

  updateScreen(createCallDto: CreateCallDto) {
    this.hubConnection?.invoke('Screen', createCallDto)
      .catch(error => console.log(error));
  }

  declineCall(callerUsername: string) {
    this.hubConnection?.invoke('Decline', callerUsername)
      .catch(error => console.log(error));
  }

  endCall(createCallDto: CreateCallDto) {
    this.hubConnection?.invoke('EndCall', createCallDto)
      .catch(error => console.log(error));
  }
  missCall(recipientUsername: string) {
    this.hubConnection?.invoke('MissCall', recipientUsername)
      .catch(error => console.log(error));
  }

}
