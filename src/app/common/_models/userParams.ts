import { User } from "./user";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastActive';

    constructor(user: User) {
        if (user.gender === 'female') {
            this.gender = 'male';
        } else if (user.gender === 'male') {
            this.gender = 'female';
        } else {
            this.gender = '';  // for other genders, show all users
        }
    }
}