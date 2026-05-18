import { ReactNode } from 'react';
import { Activity, Bell, Globe, Settings, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types/market';
import { useMarketStatus } from '@/hooks/useMarketStatus';

interface LayoutProps {
  children: ReactNode;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export function MainLayout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { data: status } = useMarketStatus();

  const stats = status?.engine;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-black tracking-tighter text-base uppercase italic">MarketGuard<span className="text-emerald-500"> AI</span></span>
          </div>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">IDX</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono flex items-center gap-1.5",
                status?.idx === 'OPEN' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                status?.idx === 'BREAK' ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                "bg-white/5 text-white/30 border border-white/5"
              )}>
                {(status?.idx === 'OPEN' || status?.idx === 'PRE-OPEN') && <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />}
                {status?.idx || '...'}
              </span>
              <span className="text-[9px] text-white/20 uppercase font-mono hidden sm:inline">{status?.session}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">GLOBAL</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono flex items-center gap-1.5",
                status?.global === 'OPEN' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-white/5 text-white/30 border border-white/5"
              )}>
                {status?.global === 'OPEN' && <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />}
                {status?.global || '...'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden lg:flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Suasana Pasar</span>
                 <span className="text-[10px] font-bold text-emerald-500 font-mono tracking-tighter uppercase">{stats?.marketMood || 'WAITING...'}</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Latency</span>
                 <span className="text-[10px] font-bold text-white/60 font-mono tracking-tighter">{stats?.latency || 0}ms</span>
              </div>
           </div>
          <div className="h-8 w-px bg-white/10 hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[10px] font-bold tracking-widest font-mono uppercase italic">Mesin AI {stats?.status === 'ONLINE' ? 'AKTIF' : stats?.status || 'Active'}</span>
              </div>
              <span className="text-[9px] text-white/20 font-mono">V 2.0.4 - STABLE</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 relative">
              <Activity className="w-4 h-4" />
              {stats?.status === 'ONLINE' && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" />}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-16 md:w-64 border-r border-white/5 bg-black flex flex-col pt-4">
          <nav className="flex-1 p-3 space-y-2">
            {[
              { id: DashboardTab.ALERTS, icon: Bell, label: 'Sinyal Live', sub: 'Monitoring AI' },
              { id: DashboardTab.WATCHLIST, icon: Globe, label: 'Market Feed', sub: 'Harga Real-time' },
              { id: DashboardTab.SETTINGS, icon: Settings, label: 'Konfigurasi', sub: 'Bot & Engine' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                  activeTab === item.id 
                    ? "bg-white/5 text-white ring-1 ring-white/10" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  activeTab === item.id ? "bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]" : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-bold tracking-tight">{item.label}</div>
                  <div className="text-[10px] opacity-40 uppercase tracking-widest font-mono">{item.sub}</div>
                </div>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/5 space-y-4">
             <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 hidden md:block">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    <Zap className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Metrics</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-mono">Last Scan</span>
                    <span className="text-[10px] text-emerald-500 font-mono font-bold">{stats?.lastScan || '--:--:--'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-mono">Watched</span>
                    <span className="text-[10px] text-white/80 font-mono font-bold">{stats?.watchedSymbols || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-mono">Signals</span>
                    <span className="text-[10px] text-white/80 font-mono font-bold">{stats?.signalsToday || 0}</span>
                  </div>
                </div>
             </div>

             <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 hidden md:block">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 <span className="text-xs font-bold text-emerald-500">AI Mentor</span>
               </div>
               <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                 AI telah dikonfigurasi untuk membaca anomali pergerakan modal di pasar saham Indonesia dan Global.
               </p>
             </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-black relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03)_0%,transparent_50%)] pointer-events-none" />
          <div className="max-w-5xl mx-auto p-6 lg:p-10 mb-20 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
