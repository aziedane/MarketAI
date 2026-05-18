import { useState, useMemo } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { SignalsView } from './components/SignalsView';
import { MarketFeedView } from './components/MarketFeedView';
import { SettingsView } from './components/SettingsView';
import { DashboardTab } from './types/market';
import { useMarketStatus } from './hooks/useMarketStatus';
import { useAlerts } from './hooks/useAlerts';

import { AppProviders } from './components/AppProviders';

function MarketApp() {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.ALERTS);
  const { data: status } = useMarketStatus();

  const pollInterval = useMemo(() => {
    if (!status) return 30000;
    return (status.idx === 'OPEN' || status.global === 'OPEN') ? 10000 : 300000;
  }, [status]);

  const { data: alerts = [], error: alertsError } = useAlerts(pollInterval);

  if (alertsError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-10 text-center">
        <div className="space-y-4">
          <div className="text-red-500 font-bold uppercase tracking-widest text-sm">Engine Error</div>
          <p className="text-white/60 max-w-sm">Koneksi ke server pusat terputus. AI sedang mencoba menyambungkan kembali...</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/10 rounded-full text-xs font-bold hover:bg-white/20 transition-colors"
          >
            REFRESH ENGINE
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === DashboardTab.ALERTS && <SignalsView alerts={alerts} />}
      {activeTab === DashboardTab.WATCHLIST && <MarketFeedView />}
      {activeTab === DashboardTab.SETTINGS && <SettingsView />}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AppProviders>
      <MarketApp />
    </AppProviders>
  );
}
