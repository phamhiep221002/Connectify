import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Group } from '../_models/group';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { BusyService } from './busy.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { ToastrService } from 'ngx-toastr';
import { ConnectedMessage } from '../_models/connectedMessage';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient, private busyService: BusyService, private toastr: ToastrService) { }

  createHubConnection(user: User, otherUsername: string) {
    this.busyService.busy();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
        transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(() => this.busyService.idle());

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            messages.forEach(message => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now())
              }
            })
            this.messageThreadSource.next([...messages]);
          }
        })
      }
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages, message])
        }
      })
    })
    this.hubConnection.on('UnsendMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          messages.splice(messages.findIndex(m => m.id === message), 1);
          this.messageThreadSource.next([...messages, message])
        }
      })
    })
  }


  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', { recipientUsername: username, content })
      .catch(error => this.toastr.error(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
  unsendMessage(id: number) {
    return this.http.put(this.baseUrl + 'messages/' + id, {});
  }
  async createLocationMessage(username: string) {
    return this.hubConnection?.invoke('CreateLocationMessage', { recipientUsername: username })
      .catch(error => this.toastr.error(error));
  }
  async sendFileMessage(username: string, file: File) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('RecipientUsername', username);

    return this.http.post(this.baseUrl + 'messages/file', formData).toPromise()
      .catch(error => this.toastr.error(error.error.message));
  }
  getconnectedMessages(pageNumber: number, pageSize: number, fullName: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('FullName', fullName);
    return getPaginatedResult<ConnectedMessage[]>(this.baseUrl + 'messages/connectedmessages', params, this.http);
  }

}