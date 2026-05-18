import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';
import { PriceData } from '../types/market';

export function usePrices(refetchInterval: number) {
  return useQuery<Record<string, PriceData>>({
    queryKey: ['prices'],
    queryFn: marketService.getPrices,
    refetchInterval,
  });
}
