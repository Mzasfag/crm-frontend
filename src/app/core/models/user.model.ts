export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IMyCustomUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  password: string;
}
