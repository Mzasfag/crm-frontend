export interface ICampaign {
  _id: string
  name: string
  channel: string
  status: string
  budget: number
  startDate: string
  endDate: string
  owner: Owner
  tenantId: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Owner {
  _id: string
  name: string
  email: string
  role: string
}
