import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }

      }
    })
  }
  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) return of(response);
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    params = params.append('distance', userParams.distance);
    if (userParams.currentLatitude && userParams.currentLongitude != null) {
      params = params.append('currentLatitude', userParams.currentLatitude);
      params = params.append('currentLongitude', userParams.currentLongitude);
    }
    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    )
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);

    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return getPaginatedResult<Member[]>(this.baseUrl + 'likes', params, this.http);
  }
  getGender() {
    return this.http.get<any>(`${this.baseUrl}gender`);
  }
  setVisible() {
    return this.http.put(this.baseUrl + 'users/visible', {});
  }
  setInvisible() {
    return this.http.put(this.baseUrl + 'users/invisible', {});
  }
  deleteAccount() {
    return this.http.put(this.baseUrl + 'users/delete-account', { responseType: 'text' as 'json' });
  }
  updateUserIntroduction(member: Member) {
    return this.http.put(this.baseUrl + 'updateintroduction', member);
}
}