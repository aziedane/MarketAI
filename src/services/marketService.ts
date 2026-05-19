import axios from 'axios';
import { Alert, PriceData } from '../types/market';

const api = axios.create({
  baseURL: '/api',
});

export const marketService = {
  getAlerts: async (): Promise<Alert[]> => {
    const { data } = await api.get('/alerts');
    return data;
  },
  
  getPrices: async (): Promise<Record<string, PriceData>> => {
    const { data } = await api.get('/prices');
    return data;
  },
  
  getWatchlist: async (): Promise<string[]> => {
    const { data } = await api.get('/watchlist');
    return data;
  },
  
  clearAlerts: async (): Promise<void> => {
    await api.post('/alerts/clear');
  }
};
