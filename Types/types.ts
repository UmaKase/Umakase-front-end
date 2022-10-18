export type Room={
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    user?:any[],
    foods?:any[],
    creator?:Profile,
    creatorId: string;
};

export type User={
  id:string,
  createdAt:string,
  updatedAt:string,
  email?:string,
  password:string,
  refreshToken?:string,
  profile?:Profile,
  tmpId?:string,
}

export type Profile={
    id:string,
    username:string,
    firstname:string,
    lastname:string,
    user?:User,
    userId:string,
    room?:Room[],
    createdRoom?:Room[],
}