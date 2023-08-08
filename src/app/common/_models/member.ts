import { Photo } from "./photo";

export interface Member {
    id: number;
    userName: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFors: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
    isVisible: boolean;
}