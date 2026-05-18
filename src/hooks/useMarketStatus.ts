import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MarketStatus, EngineStats } from '../types/market';

export interface StatusResponse extends MarketStatus {
  engine: EngineStats;
}

export function useMarketStatus() {
  return useQuery<StatusResponse>({
    queryKey: ['market-status'],
    queryFn: async () => {
      const { data } = await axios.get('/api/status');
      return data;
    },
    refetchInterval: 10000,
  });
}
