import { useWatchlist } from '@/hooks/useWatchlist';
import { usePrices } from '@/hooks/usePrices';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '@/lib/utils';

export function MarketFeedView() {
  const { data: watchlist = [] } = useWatchlist();
  const { data: prices = {} } = usePrices(10000);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Pantauan <span className="text-emerald-500">Pasar</span></h2>
          <p className="text-sm text-white/40 mt-1 uppercase font-mono tracking-tighter">Arus modal real-time dari bursa utama</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-bold font-mono text-white/40 tracking-[0.2em] uppercase">Live Data Streaming</span>
        </div>
      </div>

      <div className="grid gap-4">
        {watchlist.map((symbol, i) => {
          const data = prices[symbol];
          const isUp = (data?.change || 0) >= 0;
          
          return (
            <motion.div 
              key={symbol}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="grid grid-cols-4 md:grid-cols-6 gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.04] hover:border-white/10 transition-all items-center group relative overflow-hidden"
            >
              <div className="col-span-2 md:col-span-2 flex items-center gap-6">
                 <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                   isUp ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                 )}>
                   {isUp ? <ArrowUp className="w-6 h-6" /> : <ArrowDown className="w-6 h-6" />}
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <h4 className="font-black text-xl tracking-tighter uppercase italic group-hover:text-emerald-500 transition-colors">{symbol}</h4>
                     {i < 3 && <Star className="w-3 h-3 text-orange-500 fill-orange-500" />}
                   </div>
                   <div className="text-[10px] text-white/20 tracking-widest uppercase font-mono">
                     {symbol.endsWith('.JK') ? 'Indonesia BEI' : 'Global Market'}
                   </div>
                 </div>
              </div>

              <div className="hidden md:flex flex-col col-span-1">
                 <div className="text-[9px] text-white/20 uppercase font-mono mb-2 tracking-widest">Momentum</div>
                 <div className="flex items-center gap-1">
                   <div className="w-1 h-3 bg-emerald-500/60 rounded-full" />
                   <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                   <div className="w-1 h-2 bg-white/10 rounded-full" />
                 </div>
              </div>

              <div className="col-span-1 text-right md:text-center">
                 <div className="text-[9px] text-white/20 uppercase font-mono mb-2 tracking-widest">Price Point</div>
                 <div className="font-mono font-bold text-lg italic tracking-tighter">
                   {data ? formatCurrency(data.price, symbol.endsWith('.JK') ? 'IDR' : 'USD') : '---'}
                 </div>
              </div>

              <div className="col-span-1 md:col-span-2 text-right flex flex-col items-end">
                <div className="text-[9px] text-white/20 uppercase font-mono mb-2 tracking-widest">Net Chg %</div>
                {data ? (
                  <motion.div
                    key={data.price}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                      "flex items-center gap-1 font-mono font-black italic text-xl",
                      isUp ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {isUp ? '+' : '-'}{Math.abs(data.changePercent).toFixed(2)}%
                  </motion.div>
                ) : (
                  <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
