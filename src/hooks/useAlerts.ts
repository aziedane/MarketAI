import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';
import { Alert } from '../types/market';

export function useAlerts(refetchInterval: number) {
  return useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: marketService.getAlerts,
    refetchInterval,
  });
}
