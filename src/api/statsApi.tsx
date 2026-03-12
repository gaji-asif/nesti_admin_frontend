import { api } from './config'

export interface GroupMessageStat {
  group_id: number;
  group_name: string;
  total_messages: number;
}

export interface PeriodStat {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface Stats {
  active_accounts: number;
  deactive_accounts: number;
  friend_requests: PeriodStat;
  messages: PeriodStat;
  group_messages: GroupMessageStat[];
}

export const getStats = async (): Promise<Stats> => {
  const response = await api.get('/stats');
  return response.data?.data ?? response.data;
}