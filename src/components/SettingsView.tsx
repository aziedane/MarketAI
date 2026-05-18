import { Send, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsView() {
  return (
    <div className="space-y-12 pb-20">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] font-mono">Control Panel</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Konfigurasi <span className="text-emerald-500">Sistem</span></h2>
        <p className="text-sm text-white/40 mt-1 font-sans">Sesuaikan parameter deteksi AI dan jalur komunikasi bot.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Telegram Integration Card */}
        <div className="p-6 md:p-8 bg-[#0A0A0A] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
            <Send className="w-24 h-24 text-emerald-500 -rotate-12 translate-x-12 -translate-y-8" />
          </div>
          
          <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
              <Send className="w-6 h-6 md:w-7 md:h-7 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl tracking-tight">Integrasi Telegram</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-1">Real-time Push Alerts</p>
            </div>
          </div>
          
          <div className="space-y-4 md:space-y-6 relative z-10">
             <div className="flex items-center justify-between p-4 md:p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-sm font-medium">Broadcast Sinyal Aktif</span>
                <button className="w-11 h-5 md:w-12 md:h-6 bg-emerald-500 rounded-full p-1 transition-all">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full ml-auto" />
                </button>
             </div>
             
             <div className="p-4 md:p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
               <div className="flex items-center gap-2">
                 <Shield className="w-3 h-3 text-emerald-500" />
                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">Environment Status</span>
               </div>
               <p className="text-[10px] md:text-[10.5px] text-white/50 leading-relaxed font-sans">
                 Gunakan variabel <code className="text-emerald-400 font-mono bg-white/5 px-1.5 py-0.5 rounded">TELEGRAM_BOT_TOKEN</code> untuk mengizinkan AI Mentor mengirimkan sinyal langsung ke perangkat seluler Anda.
               </p>
             </div>
          </div>
        </div>

        {/* AI Scanner Policy Card */}
        <div className="p-6 md:p-8 bg-[#0A0A0A] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
           <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl tracking-tight">Scanner AI Policy</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-1">Sensitivity Parameters</p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            {[
              { label: 'Deteksi Volume Spike', value: 'Agresif (2.5x)', active: true },
              { label: 'Analisa Pembalikan Tren', value: 'Standard (RSI 14)', active: false },
              { label: 'Deep Market Scan', value: 'Enabled', active: true }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 md:p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all">
                 <span className="text-sm text-white/70 font-medium">{item.label}</span>
                 <span className={cn(
                   "text-[9px] md:text-[10px] font-bold font-mono tracking-tighter uppercase px-2 py-0.5 rounded",
                   item.active ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10" : "text-white/30"
                 )}>
                   {item.value}
                 </span>
              </div>
            ))}

            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/5">
              <p className="text-[10px] text-white/20 font-mono leading-relaxed italic uppercase tracking-[0.1em] text-center">
                * AI Mentor memprioritaskan keamanan modal melalui deteksi anomali volume sebelum konsolidasi teknis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
