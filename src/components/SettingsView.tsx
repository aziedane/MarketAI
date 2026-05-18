import { Send, Shield } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Konfigurasi Sistem</h2>
        <p className="text-sm text-white/40">Kelola mesin analisa AI dan tujuan notifikasi bot Anda.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <Send className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold">Integrasi Telegram</h3>
              <p className="text-xs text-white/40">Notifikasi push real-time ke HP Anda</p>
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <span className="text-sm">Broadcast Sinyal Aktif</span>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                </div>
             </div>
             <p className="text-[10px] text-white/40 leading-relaxed font-mono">
               PASTIKAN <code className="text-emerald-500 uppercase">TELEGRAM_BOT_TOKEN</code> SUDAH TERPASANG DI SIDEBAR AGAR ASISTEN BISA MENGIRIM UPDATE OTOMATIS KE CHANNEL ANDA.
             </p>
          </div>
        </div>

        <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-6">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold">Kebijakan Scanner AI</h3>
              <p className="text-xs text-white/40">Sensitivitas deteksi pergerakan market</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
             <span className="text-sm text-white/60">Deteksi Volume Spike</span>
             <span className="text-xs font-mono text-emerald-500 tracking-tighter uppercase font-bold">Agresif (2.5x)</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
             <span className="text-sm text-white/60">Analisa Pembalikan Tren</span>
             <span className="text-xs font-mono text-white/40 tracking-tighter uppercase">Standard (RSI 14)</span>
          </div>
          <div className="p-4 bg-black/40 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/40 font-mono leading-relaxed">
              * AI MEMBACA MOMENTUM BUYER DAN SELLER SEBELUM MEMBERIKAN SINYAL REKOMENDASI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
