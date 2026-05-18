import { motion } from 'motion/react';
import { TrendingUp, Zap, AlertTriangle, ChevronRight, BrainCircuit, Activity, ShieldCheck } from 'lucide-react';
import { Alert } from '@/types/market';
import { cn, formatCurrency } from '@/lib/utils';

export function SignalsView({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="py-32 md:py-44 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-8 relative transition-transform hover:scale-105">
          <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 animate-pulse" />
          <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3">AI Sedang Memantau Pasar</h3>
        <p className="max-w-md text-sm text-white/40 leading-relaxed font-sans">
          Asisten sedang membaca dinamika buyer dan seller. Belum ada sinyal kuat yang terdeteksi saat ini sesuai parameter keamanan Anda.
        </p>
        <div className="mt-8 flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold font-mono text-white/40 tracking-wider uppercase">Scanner Active: 84 Symbols</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] font-mono">Live Intel</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Sinyal Mentor <span className="text-emerald-500">AI</span></h2>
          <p className="text-sm text-white/40 mt-1 font-sans">Analisa teknikal real-time dengan konfirmasi kecerdasan buatan.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="px-4 py-1.5 rounded-xl bg-black/40 border border-white/5">
            <div className="text-[9px] text-white/30 uppercase font-mono tracking-widest">Active Alerts</div>
            <div className="text-lg font-mono font-bold leading-none mt-1">{alerts.length}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="group relative bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/20 transition-all duration-500"
          >
            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
              
              {/* Column 1: Symbol & Core Info */}
              <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start md:space-y-6">
                <div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-3 md:mb-4 transition-colors",
                    alert.signal === 'BUY' ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" :
                    alert.signal === 'SELL' ? "bg-red-500/5 text-red-400 border-red-500/20" :
                    "bg-white/5 text-white/60 border-white/10"
                  )}>
                    {alert.signal === 'BUY' && <Zap className="w-3 h-3" />}
                    {alert.signal === 'BUY' ? 'Strong Buy Signal' : alert.signal}
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold tracking-tighter group-hover:text-emerald-500 transition-colors uppercase leading-none">
                    {alert.symbol}
                  </h4>
                  <p className="text-[10px] text-white/30 font-mono mt-2 tracking-widest uppercase">
                    Ticker ID: {alert.id.split('-')[0]}
                  </p>
                </div>

                <div className="md:pt-6 md:border-t md:border-white/5 text-right md:text-left">
                  <div className="text-[10px] text-white/20 uppercase font-mono mb-1 md:mb-1.5 tracking-widest hidden md:block">Signal Price</div>
                  <div className="text-xl md:text-2xl font-mono font-bold text-white group-hover:scale-105 transition-transform origin-right md:origin-left">
                    {formatCurrency(alert.price, alert.symbol.endsWith('.JK') ? 'IDR' : 'USD')}
                  </div>
                  <div className="text-[8px] text-white/20 uppercase font-mono mt-1 md:hidden">Price Detected</div>
                </div>
              </div>

              {/* Column 2: AI Analysis & Reasoning */}
              <div className="md:col-span-6 space-y-5 md:space-y-6 bg-white/[0.01] p-4 md:p-7 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] font-mono">AI Assessment</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                     <span className="text-[9px] font-bold text-emerald-500 uppercase font-mono">{alert.marketMood} MOOD</span>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[9px] text-white/30 uppercase font-mono tracking-widest font-bold">Kondisi Pasar</div>
                      <p className="text-[11px] md:text-xs text-white/80 leading-relaxed font-sans">{alert.aiAnalysis.kondisi}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-white/30 uppercase font-mono tracking-widest font-bold">Buyer vs Seller</div>
                      <p className="text-[11px] md:text-xs text-white/80 leading-relaxed font-sans">{alert.aiAnalysis.momentum}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                      <div className="text-[9px] text-white/30 uppercase font-mono tracking-widest font-bold">Analisa Risiko</div>
                      <p className="text-[11px] md:text-xs text-white/80 leading-relaxed font-sans">{alert.aiAnalysis.risiko}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[9px] text-emerald-500/60 uppercase font-mono tracking-widest font-bold">Kesimpulan AI</div>
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <p className="text-[11px] md:text-xs text-emerald-400 font-bold leading-relaxed font-sans italic">
                          "{alert.aiAnalysis.kesimpulan}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {alert.reasons.map((reason, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 text-[9px] font-bold text-white/50 rounded-lg uppercase tracking-wider">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                      {reason}
                    </span>
                  ))}
                </div>

                {alert.warning && (
                  <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-[10px] md:text-[11px] text-red-400 font-medium italic leading-snug">{alert.warning}</p>
                  </div>
                )}
              </div>

              {/* Column 3: Metrics & Actions */}
              <div className="md:col-span-3 flex flex-col h-full justify-between gap-6 md:gap-8 md:text-right md:items-end">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 w-full">
                  <div className="flex flex-col md:items-end">
                    <div className="text-[10px] text-white/20 uppercase font-mono mb-2 tracking-widest">Confidence</div>
                    <div className="flex items-center md:flex-row-reverse gap-3">
                      <div className="text-2xl md:text-3xl font-mono font-bold text-white">
                        {alert.confidence}<span className="text-sm text-white/40 font-normal">%</span>
                      </div>
                      <div className="w-12 md:w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${alert.confidence}%` }}
                          viewport={{ once: true }}
                          className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end">
                    <div className="text-[10px] text-white/20 uppercase font-mono mb-2 tracking-widest text-right">Risk Level</div>
                    <div className="flex justify-end gap-1.5">
                      {[1,2,3,4,5].map(tick => (
                        <div 
                          key={tick} 
                          className={cn(
                            "h-5 w-1 rounded-full bg-white/5 transition-colors duration-700",
                            tick <= (alert.riskLevel === 'HIGH' ? 5 : alert.riskLevel === 'MEDIUM' ? 3 : 1) && 
                            (alert.riskLevel === 'HIGH' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" : 
                             alert.riskLevel === 'MEDIUM' ? "bg-orange-500" : "bg-emerald-500")
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-3 w-full border-t border-white/5 pt-4 md:border-0 md:pt-0">
                  <p className="text-[9px] text-white/20 uppercase font-mono tracking-widest italic">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <button className="flex items-center gap-2 justify-center md:justify-end text-[11px] font-bold text-white bg-white/5 px-4 py-2 md:py-2 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all uppercase tracking-wider group/btn">
                    Details 
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

            {/* Hover Accent */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500/0 md:group-hover:bg-emerald-500/40 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
