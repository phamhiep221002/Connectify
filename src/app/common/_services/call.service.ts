import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { User } from '../_models/user';
import { BusyService } from './busy.service';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private busyService: BusyService, private toastr: ToastrService) {}

  createHubConnection(user: User, otherUsername: string) {
    debugger
    this.busyService.busy();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'call?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start()
    .catch(error => console.log(error))
    .finally(() => this.busyService.idle());
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.callStatusSource.next([]);
      this.hubConnection.stop();
    }
  }

  // async acceptCall(username: string) {
  //   return this.hubConnection?.invoke('AcceptCall', { callerUsername: username })
  //     .catch(error => this.toastr.error(error));
  // }

  // async startCall(username: string) {
  //   return this.hubConnection?.invoke('StartCall', { recipientUsername: username })
  //     .catch(error => this.toastr.error(error));
  // }

  // async endCall(username: string) {
  //   return this.hubConnection?.invoke('EndCall', { recipientUsername: username })
  //     .catch(error => this.toastr.error(error));
  // }
  // async updateMicroState(username: string, isEnabled: boolean) {
  //   const dto = new CreateCallDto();
  //   dto.recipientUsername = username;
  //   dto.isVoiceEnabled = isEnabled;
  //   return this.hubConnection?.invoke('Micro', dto)
  //     .catch(error => this.toastr.error(error));
  // }

  // async updateCameraState(username: string, isEnabled: boolean) {
  //   const dto = new CreateCallDto();
  //   dto.recipientUsername = username;
  //   dto.isVideoEnabled = isEnabled;
  //   return this.hubConnection?.invoke('Camera', dto)
  //     .catch(error => this.toastr.error(error));
  // }

  // async updateScreenState(username: string, isEnabled: boolean) {
  //   const dto = new CreateCallDto();
  //   dto.recipientUsername = username;
  //   dto.isScreenSharingEnabled = isEnabled;
  //   return this.hubConnection?.invoke('Screen', dto)
  //     .catch(error => this.toastr.error(error));
  // }
}
