import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Zap, AlertTriangle, ChevronRight, BrainCircuit, Activity, ShieldCheck, X, BarChart2, Info, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '@/types/market';
import { cn, formatCurrency } from '@/lib/utils';
import { marketService } from '@/services/marketService';
import { useQueryClient } from '@tanstack/react-query';

export function SignalsView({ alerts }: { alerts: Alert[] }) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const queryClient = useQueryClient();

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    
    setIsClearing(true);
    try {
      await marketService.clearAlerts();
      queryClient.setQueryData(['alerts'], []);
      setConfirmClear(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClearing(false);
    }
  };

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
          <button 
            onClick={handleClear}
            disabled={isClearing || alerts.length === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group/clear",
              confirmClear ? "bg-red-500 text-white animate-pulse" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
            )}
          >
            <Trash2 className="w-3.5 h-3.5 group-hover/clear:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {confirmClear ? 'Yakin?' : 'Bersihkan'}
            </span>
          </button>
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
                  <button 
                    onClick={() => setSelectedAlert(alert)}
                    className="flex items-center gap-2 justify-center md:justify-end text-[11px] font-bold text-white bg-white/5 px-4 py-2 md:py-2 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all uppercase tracking-wider group/btn"
                  >
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

      {/* Details Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0F0F0F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border",
                    selectedAlert.signal === 'BUY' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    selectedAlert.signal === 'SELL' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    "bg-white/5 text-white/60 border-white/10"
                  )}>
                    {selectedAlert.signal === 'BUY' ? <Zap className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase">{selectedAlert.symbol}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{selectedAlert.type} Signal</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">{selectedAlert.confidence}% Confidence</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-12">
                
                {/* Advanced Briefing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                       <BarChart2 className="w-4 h-4 text-emerald-500" />
                       <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] font-mono">Market Intel Summary</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-[9px] text-white/30 uppercase font-mono tracking-widest mb-2">Detection Price</div>
                        <div className="text-xl font-mono font-bold text-white">{formatCurrency(selectedAlert.price, selectedAlert.symbol.endsWith('.JK') ? 'IDR' : 'USD')}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/30 uppercase font-mono tracking-widest mb-2">Market Mood</div>
                        <div className="text-xl font-mono font-bold text-emerald-500 uppercase">{selectedAlert.marketMood}</div>
                      </div>
                    </div>

                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 text-white/40">
                         <Info className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-bold font-mono tracking-widest uppercase">AI Executive Briefing</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed italic font-sans">
                        "{selectedAlert.aiAnalysis.kesimpulan}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                       <ShieldCheck className="w-4 h-4 text-emerald-500" />
                       <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] font-mono">Technical Validation</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-xs text-white/40">Relative Strength (RSI)</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">Bullish Momentum</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-xs text-white/40">Volume Confirmation</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">High Accumulation</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-xs text-white/40">Trend Status</span>
                        <span className="text-xs font-mono font-bold text-white uppercase">{selectedAlert.trend}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Breakdown */}
                <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-3xl p-6 md:p-8 space-y-8">
                  <div className="flex items-center gap-3">
                     <BrainCircuit className="w-5 h-5 text-emerald-500" />
                     <h4 className="text-lg font-bold tracking-tight">AI Reasoning Breakdown</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <h5 className="text-[10px] font-bold text-emerald-500/60 uppercase font-mono tracking-[0.2em]">Kondisi Objektif</h5>
                       <p className="text-xs text-white/60 leading-relaxed font-sans">{selectedAlert.aiAnalysis.kondisi}</p>
                    </div>
                    <div className="space-y-2">
                       <h5 className="text-[10px] font-bold text-emerald-500/60 uppercase font-mono tracking-[0.2em]">Analisa Momentum</h5>
                       <p className="text-xs text-white/60 leading-relaxed font-sans">{selectedAlert.aiAnalysis.momentum}</p>
                    </div>
                    <div className="space-y-2">
                       <h5 className="text-[10px] font-bold text-emerald-500/60 uppercase font-mono tracking-[0.2em]">Manajemen Risiko</h5>
                       <p className="text-xs text-white/60 leading-relaxed font-sans">{selectedAlert.aiAnalysis.risiko}</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex flex-wrap gap-3">
                    {selectedAlert.reasons.map((reason, idx) => (
                      <div key={idx} className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[11px] text-white/40 font-mono tracking-wider uppercase">
                    Data analyzed at {new Date(selectedAlert.timestamp).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="w-full md:w-auto px-8 py-4 bg-emerald-500 text-black font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_8px_20px_rgba(16,185,129,0.2)]"
                >
                  Confirm Understanding
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
