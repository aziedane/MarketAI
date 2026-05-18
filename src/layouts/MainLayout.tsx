import { ReactNode } from 'react';
import { Activity, Bell, Globe, Settings, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
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
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-105">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tight text-base md:text-lg">MarketGuard <span className="text-emerald-500 font-medium">AI</span></span>
          </div>
          
          <div className="hidden sm:flex items-center gap-6 ml-6 border-l border-white/10 pl-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono mb-0.5">IDX Status</span>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  status?.idx === 'OPEN' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/20"
                )} />
                <span className={cn(
                  "text-[10px] font-bold font-mono",
                  status?.idx === 'OPEN' ? "text-emerald-400" : "text-white/40"
                )}>{status?.idx || 'CONNECTING'}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono mb-0.5">Global</span>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  status?.global === 'OPEN' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/20"
                )} />
                <span className={cn(
                  "text-[10px] font-bold font-mono",
                  status?.global === 'OPEN' ? "text-emerald-400" : "text-white/40"
                )}>{status?.global || 'SYNCING'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden lg:flex items-center gap-8 border-r border-white/10 pr-8">
            <div className="text-right">
              <div className="text-[9px] text-white/30 uppercase tracking-widest font-mono mb-0.5">Market Sentiment</div>
              <div className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded border font-mono uppercase tracking-tight",
                stats?.marketMood === 'BULLISH' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                stats?.marketMood === 'BEARISH' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                "bg-white/5 text-white/40 border-white/10"
              )}>
                {stats?.marketMood || 'ANALYZING...'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-white/30 uppercase tracking-widest font-mono mb-0.5">Latency</div>
              <div className="text-[10px] font-bold text-white/60 font-mono tracking-tighter">
                {stats?.latency || 0}<span className="text-[8px] opacity-40 ml-0.5">ms</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
             <div className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer relative group">
                <Bell className="w-4 h-4 text-white/60 group-hover:text-white" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050505]" />
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 border border-white/10 flex items-center justify-center text-black font-bold text-xs">
               AZ
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10 flex-col md:flex-row">
        {/* Sidebar Nav - Desktop */}
        <aside className="hidden md:flex w-64 border-r border-white/5 bg-black/20 backdrop-blur-sm flex-col">
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {[
              { id: DashboardTab.ALERTS, icon: Bell, label: 'Live Alerts', sub: 'AI Signal Stream' },
              { id: DashboardTab.WATCHLIST, icon: Globe, label: 'Market Feed', sub: 'Real-time Quotes' },
              { id: DashboardTab.SETTINGS, icon: Settings, label: 'Configuration', sub: 'Engine Controls' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 relative group",
                  activeTab === item.id 
                    ? "bg-white/5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]" 
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-2xl"
                  />
                )}
                <div className={cn(
                  "relative z-10 p-2.5 rounded-xl transition-all duration-300",
                  activeTab === item.id 
                    ? "bg-emerald-500 text-black shadow-[0_0_15px_-2px_rgba(16,185,129,0.4)]" 
                    : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <item.icon className="w-5 h-5 md:w-4 md:h-4" />
                </div>
                <div className="hidden md:block text-left relative z-10">
                  <div className="text-sm font-bold tracking-tight">{item.label}</div>
                  <div className="text-[10px] opacity-40 uppercase tracking-[0.1em] font-mono mt-0.5">{item.sub}</div>
                </div>
                {activeTab === item.id && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full hidden md:block" />
                )}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/5 space-y-4">
             <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 hidden md:block group hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">Core Metrics</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-mono tracking-tighter">Last Scan</span>
                    <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-tighter">{stats?.lastScan || 'PENDING'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-mono tracking-tighter">Pool Size</span>
                    <span className="text-[10px] text-white font-mono font-bold">{stats?.watchedSymbols || 0} Assets</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-mono tracking-tighter">Signals/24h</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">+{stats?.signalsToday || 0} Det</span>
                  </div>
                </div>
             </div>

             <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 hidden md:flex flex-col gap-2">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">AI Intelligence</span>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed font-sans font-medium">
                 Analyzing market volume anomalies across multiple exchanges.
               </p>
             </div>
          </div>
        </aside>

        {/* Bottom Nav - Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/5 px-2 flex items-center justify-around z-50">
          {[
            { id: DashboardTab.ALERTS, icon: Bell, label: 'Alerts' },
            { id: DashboardTab.WATCHLIST, icon: Globe, label: 'Markets' },
            { id: DashboardTab.SETTINGS, icon: Settings, label: 'Config' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all relative",
                activeTab === item.id ? "text-emerald-500" : "text-white/30"
              )}
            >
              <item.icon className={cn("w-6 h-6", activeTab === item.id ? "text-emerald-500" : "text-white/40")} />
              <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-1 w-8 h-0.5 bg-emerald-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-black/40 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_50%)] pointer-events-none" />
          <div className="max-w-5xl mx-auto p-4 md:p-10 mb-24 md:mb-20 relative z-10">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
