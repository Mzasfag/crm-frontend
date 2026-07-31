export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: AssignedTo;
  customerId: CustomerId;
  dealId: DealId;
  tenantId: string;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AssignedTo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface CustomerId {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  status: string;
}

export interface DealId {
  _id: string;
  title: string;
  value: number;
  stage: string;
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
  role: string;
}
