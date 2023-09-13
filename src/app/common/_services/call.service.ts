import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { CreateCallDto } from '../_models/call';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private callStatusSource = new BehaviorSubject<CreateCallDto[]>([]);
  callStatus$ = this.callStatusSource.asObservable();

  constructor() {}

  createHubConnection(user: User, otherUsername: string) {
    // Tạo kết nối tới CallHub
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'call?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    // Bắt đầu kết nối
    this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(() => {
        // Khi kết nối thành công, bạn có thể thực hiện các hành động ở đây
      });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.callStatusSource.next([]);
      this.hubConnection.stop();
    }
  }

  // Gọi phương thức AcceptCall trên CallHub
  acceptCall(createCallDto: CreateCallDto) {
    if (this.hubConnection) {
      this.hubConnection.invoke('AcceptCall', createCallDto)
        .catch(error => console.log(error));
    }
  }

  // Gọi phương thức StartCall trên CallHub
  startCall(createCallDto: CreateCallDto) {
    if (this.hubConnection) {
      this.hubConnection.invoke('StartCall', createCallDto)
        .catch(error => console.log(error));
    }
  }

  // Gọi phương thức EndCall trên CallHub
  endCall(createCallDto: CreateCallDto) {
    if (this.hubConnection) {
      this.hubConnection.invoke('EndCall', createCallDto)
        .catch(error => console.log(error));
    }
  }
}
