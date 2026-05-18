import { useWatchlist } from '@/hooks/useWatchlist';
import { usePrices } from '@/hooks/usePrices';
import { ArrowUp, ArrowDown, Star, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '@/lib/utils';

export function MarketFeedView() {
  const { data: watchlist = [] } = useWatchlist();
  const { data: prices = {} } = usePrices(10000);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] font-mono">Market Pulse</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Bursa <span className="text-emerald-500">Global</span></h2>
          <p className="text-sm text-white/40 mt-1 font-sans">Aliran data real-time dari bursa efek utama dunia.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold font-mono text-white/40 tracking-wider uppercase">Live Sync Active</span>
        </div>
      </div>

      <div className="grid gap-3">
        {/* Table Header for Desktop */}
        <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="col-span-4 text-[9px] text-white/30 uppercase font-mono tracking-widest font-bold">Trading Instrument</div>
          <div className="col-span-2 text-[9px] text-white/30 uppercase font-mono tracking-widest font-bold text-center">Momentum</div>
          <div className="col-span-3 text-[9px] text-white/30 uppercase font-mono tracking-widest font-bold text-right">Current Price</div>
          <div className="col-span-3 text-[9px] text-white/30 uppercase font-mono tracking-widest font-bold text-right">Net Change / %</div>
        </div>

        {watchlist.map((symbol, i) => {
          const data = prices[symbol];
          const isUp = (data?.change || 0) >= 0;
          
          return (
            <motion.div 
              key={symbol}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-5 md:p-8 bg-[#0A0A0A] border border-white/5 rounded-3xl hover:border-emerald-500/20 transition-all duration-300 items-center group relative overflow-hidden"
            >
              <div className="md:col-span-4 flex items-center gap-4 md:gap-5">
                 <div className={cn(
                   "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all border shrink-0",
                   isUp ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" : "bg-red-500/5 text-red-400 border-red-500/20"
                 )}>
                   {isUp ? <ArrowUp className="w-4 h-4 md:w-5 md:h-5 shadow-[0_0_10px_rgba(52,211,153,0.3)]" /> : <ArrowDown className="w-4 h-4 md:w-5 md:h-5" />}
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                     <h4 className="font-bold text-xl md:text-2xl tracking-tighter uppercase group-hover:text-emerald-500 transition-colors leading-none">
                       {symbol}
                     </h4>
                     {i < 3 && <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-400 fill-orange-400" />}
                   </div>
                   <div className="text-[9px] md:text-[10px] text-white/20 tracking-widest uppercase font-mono">
                     {symbol.endsWith('.JK') ? 'Indonesia BEI' : 'Global Equities'}
                   </div>
                 </div>
              </div>

              <div className="hidden md:flex flex-col md:col-span-2 items-center">
                 <div className="flex items-center gap-1.5 p-1.5 bg-black/40 rounded-lg border border-white/5">
                    {[1,2,3,4,5].map(t => (
                      <div key={t} className={cn(
                        "w-1 rounded-full bg-white/5",
                        t === 1 ? "h-3" : t === 2 ? "h-4" : t === 3 ? "h-5" : t === 4 ? "h-3" : "h-2",
                        isUp && t <= 3 ? "bg-emerald-500/40" : ""
                      )} />
                    ))}
                 </div>
              </div>

              <div className="md:col-span-3 md:text-right flex justify-between md:flex-col pt-3 md:pt-0 border-t md:border-0 border-white/5">
                 <div className="md:hidden text-[9px] text-white/30 uppercase font-mono tracking-widest mb-1 font-bold">Signal Price</div>
                 <div className="font-mono font-bold text-lg md:text-xl text-white">
                   {data ? formatCurrency(data.price, symbol.endsWith('.JK') ? 'IDR' : 'USD') : '---'}
                 </div>
              </div>

              <div className="md:col-span-3 text-right flex justify-between md:flex-col">
                <div className="md:hidden text-[9px] text-white/30 uppercase font-mono tracking-widest mb-1 font-bold">24h Change</div>
                {data ? (
                  <motion.div
                    key={data.price}
                    className={cn(
                      "flex items-center gap-1.5 font-mono font-bold text-base md:text-lg md:justify-end",
                      isUp ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    <span className="text-[10px] md:text-[11px] opacity-40 font-mono">
                       {isUp ? '+' : ''}{formatCurrency(data.change, symbol.endsWith('.JK') ? 'IDR' : 'USD').replace('Rp', '')}
                    </span>
                    {isUp ? '+' : '-'}{Math.abs(data.changePercent).toFixed(2)}%
                  </motion.div>
                ) : (
                  <div className="h-6 w-24 bg-white/5 rounded-xl animate-pulse ml-auto" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
