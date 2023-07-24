import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';
import { ResetPasswordDto } from '../_models/resetPasswordDto';
import { OperationResult } from '../_models/operation-result';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  private emailSource = new BehaviorSubject<string | null>(null);
  email$ = this.emailSource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }
  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }
  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }
  getGender(): Observable<any> {
    return this.http.get(`${this.baseUrl}gender`);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

  async forgotPassword(email: string): Promise<void> {
    const forgotPasswordDto = { email };
    await this.http.post(this.baseUrl + 'account/forgot-password', forgotPasswordDto, { responseType: 'text' }).toPromise();
  }

  async resetPassword(param: ResetPasswordDto): Promise<void> {
    const url = `${this.baseUrl}account/reset-password/${param.email}/${param.token}`;
    param.token = decodeURIComponent(param.token)
    await this.http.put(url, param, { responseType: 'text' }).toPromise();
  }
}