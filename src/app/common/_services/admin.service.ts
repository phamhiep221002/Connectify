import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Genders } from '../_models/gender';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsersWithRoles(){
    return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post<string[]>(this.baseUrl + 'admin/edit-roles/' 
      + username + '?roles=' + roles, {});
  }
  blockUser(username: string) {
    return this.http.put(this.baseUrl + 'admin/block/' + username, { responseType: 'text' as 'json' });
  }
  
  unblockUser(username: string) {
    return this.http.put(this.baseUrl + 'admin/unblock/' + username, { responseType: 'text' as 'json' });
  }
  getGenders() {
    return this.http.get<Genders[]>(this.baseUrl + 'gender');
  }
  createGender(gender: Genders) {
    return this.http.post<Genders>(this.baseUrl + 'gender', gender, { responseType: 'text' as 'json' });
  }

  updateGender(gender: Genders, id: number) {
    return this.http.put<Genders>(this.baseUrl + 'gender/' + id, gender, { responseType: 'text' as 'json' });
  }

  deleteGender(id: number) {
    return this.http.delete<Genders>(this.baseUrl + 'gender/' + id, { responseType: 'text' as 'json' });
  }
}
