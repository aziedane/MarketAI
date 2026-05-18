export type AlertType = 'BREAKOUT' | 'VOL_SPIKE' | 'OVERSOLD' | 'REVERSAL' | 'TREND_CHANGE';

export enum DashboardTab {
  ALERTS = "alerts",
  WATCHLIST = "watchlist",
  SETTINGS = "settings",
}

export interface Alert {
  id: string;
  symbol: string;
  price: number;
  type: AlertType;
  message: string;
  timestamp: number;
  
  // AI Enhanced Fields
  signal: 'BUY' | 'SELL' | 'WATCH' | 'HIGH_RISK';
  confidence: number;
  trend: 'bullish' | 'bearish' | 'sideways';
  marketMood: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  volumeCondition: string;
  aiAnalysis: string;
  reasons: string[];
  warning: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdate: number;
}

export interface MarketStatus {
  idx: 'OPEN' | 'CLOSED' | 'BREAK' | 'PRE-OPEN';
  global: 'OPEN' | 'CLOSED';
  session: string;
  timeWIB: string;
}

export interface EngineStats {
  status: 'ONLINE' | 'STANDBY';
  lastScan: string;
  watchedSymbols: number;
  signalsToday: number;
  marketMood: 'BULLISH' | 'BEARISH' | 'SIDEWAYS' | 'VOLATILE';
  latency: number;
}
