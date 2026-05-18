import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';

export function useWatchlist() {
  return useQuery<string[]>({
    queryKey: ['watchlist'],
    queryFn: marketService.getWatchlist,
    staleTime: 600000, // 10 mins
  });
}
