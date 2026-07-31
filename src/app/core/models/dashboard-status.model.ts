export interface IDashboardStatus {
  summary: ISummary
  dealsRevenue: IDealsRevenue
  recentActivity: IRecentActivity
  customers: ICustomers
  users: IUsers
  tasksOverview: ITasksOverview
  monthlyGrowth: IMonthlyGrowth
  campaignsOverview: ICampaignsOverview
  deals: IDeals
}

export interface ISummary {
  totalCustomers: number
  totalUsers: number
  totalDeals: number
  openDeals: number
  wonDeals: number
  lostDeals: number
  totalDealValue: number
  pipelineValue: number
  totalRevenue: number
  averageDealValue: number
  winRate: number
  conversionRate: number
}

export interface IDealsRevenue {
  totalDeals: number
  totalRevenue: number
  conversionRate: number
  dealsByStage: DealsByStage[]
}

export interface DealsByStage {
  stage: string
  count: number
  totalValue: number
}

export interface IRecentActivity {
  latestDeals: LatestDeal[]
  latestCustomers: LatestCustomer[]
}

export interface LatestDeal {
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
  companyName: string
  status: string
}

export interface AssignedTo {
  _id: string
  name: string
  email: string
  role: string
}

export interface LatestCustomer {
  _id: string
  name: string
  email: string
  companyName: string
  status: string
  createdAt: string
}

export interface ICustomers {
  byStatus: ByStatu[]
  recent: Recent[]
}

export interface ByStatu {
  count: number
  status: string
}

export interface Recent {
  _id: string
  name: string
  email: string
  companyName: string
  status: string
  createdAt: string
}

export interface IUsers {
  byRole: ByRole[]
}

export interface ByRole {
  count: number
  role: string
}

export interface ITasksOverview {
  totalTasks: number
  pendingTasks: number
  inProgressTasks: number
  completedTasks: number
  overdueTasks: number
  completionRate: number
  byStatus: any[]
  byAssignee: any[]
}

export interface IMonthlyGrowth {
  currentMonth: CurrentMonth
  previousMonth: PreviousMonth
  revenueGrowthPercentage: number
  wonDealsGrowthPercentage: number
}

export interface CurrentMonth {
  revenue: number
  wonDeals: number
}

export interface PreviousMonth {
  revenue: number
  wonDeals: number
}

export interface ICampaignsOverview {
  totalCampaigns: number
  activeCampaigns: number
  completedCampaigns: number
  pausedCampaigns: number
  draftCampaigns: number
  totalBudget: number
  activeBudget: number
  completionRate: number
  byStatus: ByStatu2[]
  byChannel: ByChannel[]
}

export interface ByStatu2 {
  count: number
  budget: number
  status: string
}

export interface ByChannel {
  count: number
  budget: number
  channel: string
}

export interface IDeals {
  byStage: ByStage[]
  monthlyRevenue: MonthlyRevenue[]
  topAssignedUsers: TopAssignedUser[]
  recent: Recent2[]
}

export interface ByStage {
  stage: string
  count: number
  totalValue: number
}

export interface MonthlyRevenue {
  revenue: number
  wonDeals: number
  year: number
  month: number
}

export interface TopAssignedUser {
  totalDeals: number
  wonDeals: number
  revenue: number
  pipelineValue: number
  userId: string
  name: string
  email: string
  role: string
}

export interface Recent2 {
  _id: string
  title: string
  value: number
  stage: string
  customerId: CustomerId2
  assignedTo: AssignedTo2
  tenantId: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CustomerId2 {
  _id: string
  name: string
  email: string
  companyName: string
  status: string
}

export interface AssignedTo2 {
  _id: string
  name: string
  email: string
  role: string
}
