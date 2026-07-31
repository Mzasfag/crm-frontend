export interface IDeal {
  _id: string
  title: string
  value: number
  stage: string
  customerId: CustomerId
  assignedTo: AssignedTo
  tenantId: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CustomerId {
  _id: string
  name: string
  email: string
  phone: string
  companyName: string
  status: string
}

export interface AssignedTo {
  _id: string
  name: string
  email: string
  role: string
}
