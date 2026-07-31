import { IUser } from "./user.model";

export interface ILoginResponse {
user:IUser,
token:string
}
