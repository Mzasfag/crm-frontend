export interface ICustomer {
  _id: string
  name: string
  email: string
  phone: string
  companyName: string
  status: string
  tenantId: string
  createdBy: CreatedBy
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreatedBy {
  _id: string
  name: string
  email: string
  role: string
}