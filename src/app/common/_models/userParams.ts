import { User } from "./user";

export class UserParams {
    gender!: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 6;
    orderBy = 'lastActive';
    distance = 50; 
    constructor(user: User) {
        if (user.gender === '') {
            this.gender = '';
        }  else {
            this.gender = '';
        }
    }
}