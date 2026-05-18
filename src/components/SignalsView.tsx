import { motion } from 'motion/react';
import { TrendingUp, Zap, AlertTriangle, ChevronRight, BrainCircuit, Activity, ShieldCheck } from 'lucide-react';
import { Alert } from '@/types/market';
import { cn, formatCurrency } from '@/lib/utils';

export function SignalsView({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="py-44 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-center mb-8 relative">
          <BrainCircuit className="w-10 h-10 text-emerald-500 animate-pulse" />
          <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight mb-3">AI Sedang Memantau Pasar</h3>
        <p className="max-w-md text-sm text-white/40 leading-relaxed">
          Asisten sedang membaca dinamika buyer dan seller. Belum ada sinyal kuat yang terdeteksi saat ini sesuai parameter keamanan Anda.
        </p>
        <div className="mt-8 flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold font-mono text-white/40 tracking-widest uppercase">Scanner Active: 84 Symbols</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Analisa Mentor <span className="text-emerald-500">AI</span></h2>
          <p className="text-sm text-white/40 mt-1 uppercase font-mono tracking-tighter">Sinyal teknikal terdeteksi secara algoritmis</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-emerald-500/20 transition-all hover:bg-white/[0.03] relative overflow-hidden"
          >
            {/* Confidence Background */}
            <div 
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/[0.02] border-l border-white/5 pointer-events-none transition-all group-hover:bg-emerald-500/[0.04]" 
              style={{ width: `${alert.confidence / 2}%` }}
            />

            {/* Badge & Symbol */}
            <div className="md:col-span-3 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={cn(
                    "text-[10px] font-black px-2.5 py-1 rounded border",
                    alert.signal === 'BUY' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    alert.signal === 'SELL' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    alert.signal === 'HIGH_RISK' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-white/10 text-white/60 border-white/5"
                  )}>
                    {alert.signal === 'BUY' ? 'REKOMENDASI BELI' : alert.signal}
                  </span>
                </div>
                <h4 className="text-3xl font-black tracking-tighter group-hover:text-emerald-500 transition-colors uppercase italic">{alert.symbol}</h4>
                <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono mt-2">
                  {alert.symbol.endsWith('.JK') ? 'IDN Exchange' : 'Global Market'}
                </div>
              </div>
              
              <div className="mt-8 md:mt-0">
                 <div className="text-[10px] text-white/20 uppercase font-mono mb-1 tracking-widest px-1">Entry Price</div>
                 <div className="text-2xl font-mono font-black italic">
                   {formatCurrency(alert.price, alert.symbol.endsWith('.JK') ? 'IDR' : 'USD')}
                 </div>
              </div>
            </div>

            {/* Analysis */}
            <div className="md:col-span-6 flex flex-col justify-center relative z-10">
              <div className="p-6 rounded-[32px] bg-black/60 border border-white/5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest font-mono">Market Mentor AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white/30 uppercase font-mono tracking-widest">Mood:</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono">{alert.marketMood}</span>
                  </div>
                </div>
                
                <p className="text-sm text-white font-medium leading-relaxed italic mb-4">
                  "{alert.aiAnalysis}"
                </p>

                {alert.reasons && alert.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {alert.reasons.map((reason, idx) => (
                      <span key={idx} className="text-[9px] font-black px-2 py-0.5 bg-white/5 border border-white/5 text-white/40 rounded uppercase tracking-tighter">
                        {reason}
                      </span>
                    ))}
                  </div>
                )}

                {alert.warning && (
                  <div className="mb-4 flex items-start gap-2 p-2.5 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-red-500/80 font-medium italic">{alert.warning}</p>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] text-white/30 uppercase font-mono mb-1 tracking-widest">Buy Pressure</div>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500" style={{ width: `${alert.confidence}%` }} />
                       </div>
                       <span className="text-[10px] font-mono text-emerald-500">{alert.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-white/30 uppercase font-mono mb-1 tracking-widest">Risk Meter</div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(tick => (
                        <div 
                          key={tick} 
                          className={cn(
                            "h-1 w-3 rounded-full",
                            tick <= (alert.riskLevel === 'HIGH' ? 5 : alert.riskLevel === 'MEDIUM' ? 3 : 1) 
                              ? (alert.riskLevel === 'HIGH' ? "bg-red-500" : alert.riskLevel === 'MEDIUM' ? "bg-orange-500" : "bg-emerald-500") 
                              : "bg-white/5"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-6 px-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-white/40" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">Dinamika: {alert.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn("w-3 h-3 uppercase", alert.trend === 'bullish' ? "text-emerald-500" : "text-white/40")} />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">Trend: {alert.trend}</span>
                </div>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="md:col-span-3 flex flex-col justify-center items-end text-right relative z-10">
               <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mb-3">AI Confidence</div>
               
               <div className="text-5xl font-mono font-black italic text-emerald-500 leading-none mb-1">
                 {alert.confidence}<span className="text-xl">%</span>
               </div>
               
               <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden mb-6 mt-2 self-end">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${alert.confidence}%` }}
                   className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                 />
               </div>
               
               <button className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors group/btn">
                 Detail Analysis <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
