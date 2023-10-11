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
}
