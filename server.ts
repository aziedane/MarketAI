import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import yahooFinance from "yahoo-finance2";
// Handle yahoo-finance2 initialization to avoid "Call new YahooFinance() first" error
// @ts-ignore
const yahoo = (function() {
  if (yahooFinance && (yahooFinance as any).YahooFinance) {
    return new (yahooFinance as any).YahooFinance();
  }
  if (typeof yahooFinance === "function") {
    return new (yahooFinance as any)();
  }
  return yahooFinance;
})();
import { RSI, SMA } from "technicalindicators";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";

import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
const PORT = 3690;

app.use(cors());
app.use(express.json());

// Helper: AI Market Analyst Brain
async function getAIAnalysis(data: {
  symbol: string;
  price: number;
  rsi: number;
  sma20: number;
  volume: number;
  avgVolume20: number;
  type: string;
}): Promise<any> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found. Using fallback analysis.");
    return {
      signal: data.rsi < 30 ? 'WATCH' : 'WATCH',
      confidence: 60,
      trend: 'sideways',
      market_mood: 'Pasar sedang tenang',
      risk_level: 'MEDIUM',
      volume_condition: data.volume > data.avgVolume20 ? 'Ramai' : 'Biasa saja',
      analysis: `Analisis untuk ${data.symbol}. RSI berada di ${data.rsi.toFixed(1)}. Belum ada data AI mendalam.`,
      reason: ["Indikator RSI menunjukkan area tertentu", "SMA 20 sebagai acuan"],
      warning: "Gunakan analisis mandiri karena otak AI sedang offline."
    };
  }

  try {
    const prompt = `
    Analisis teknikal untuk ${data.symbol}:
    - Harga: ${data.price}
    - RSI: ${data.rsi.toFixed(1)}
    - SMA 20: ${data.sma20.toFixed(2)}
    - Volume: ${data.volume} (Rata-rata 20 hari: ${data.avgVolume20.toFixed(0)})
    - Signal Awal: ${data.type}
    
    Tugas Anda adalah memberikan analisis sesuai dengan identitas Anda sebagai AI Market Analyst Indonesia.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `
        Anda adalah pengamat market cerdas "MarketGuard AI" yang memantau market global (NASDAQ, NYSE, Crypto) dan Indonesia (IDX).
        Tugas Anda adalah membaca suasana market seperti membaca keramaian pasar nyata dan menjelaskannya dengan bahasa manusia yang SANGAT SEDERHANA.

        ATURAN UTAMA:
        1. JANGAN gunakan istilah teknikal (RSI, EMA, SMA, breakout, resistance, support, overbought, oversold).
        2. GUNAKAN BAHASA PASAR NYATA. Fokus pada kekuatan "Pembeli" (Buyer) vs "Penjual" (Seller), keramaian market, dan emosi trader.
        3. GAYA BAHASA: Santai profesional, singkat, jelas, cocok untuk notifikasi Telegram.
        4. ANALOGI & FRASA:
           - "Pembeli mulai ramai masuk."
           - "Penjual mulai menekan harga."
           - "Saham mulai diborong perlahan."
           - "Pasar masih sepi dan belum ada arah jelas."
           - "Pergerakan mulai panas."
           - "Harga mulai naik seperti barang yang mulai diperebutkan."
           - "Volume transaksi meningkat seperti pasar yang tiba-tiba ramai."
           - "Buyer terlihat lebih kuat daripada seller."
           - "Mulai ada tanda pengumpulan barang."
           - "Pasar global sedang takut dan banyak trader memilih keluar."
           - "Crypto sedang sangat liar dan penuh emosi."
           - "Saham teknologi Amerika mulai ramai diburu trader."

        5. SKENARIO KHUSUS:
           - Jika market kuat: "Pembeli masuk agresif dan penjual mulai kesulitan menahan harga."
           - Jika market bahaya: "Harga terlihat naik, tetapi tenaga pembeli belum cukup kuat. Risiko dibalik turun masih besar."
           - Jika market panas: "Pasar sedang ramai seperti rebutan barang saat diskon besar."
           - Jika market sepi: "Trader masih menunggu dan belum banyak yang berani masuk."

        6. PRIORITAS: Cari tanda panic sell, akumulasi (borong pelan), momentum besar, atau jebakan market.

        Output HARUS JSON VALID:
        {
          "symbol": string,
          "signal": "BUY" | "SELL" | "WATCH" | "HIGH_RISK",
          "confidence": number (50-95),
          "trend": "bullish" | "bearish" | "sideways",
          "market_mood": string (singkat, bahasa pasar),
          "risk_level": "LOW" | "MEDIUM" | "HIGH",
          "volume_condition": string (singkat, bahasa pasar),
          "analysis": string (Gunakan bahasa pasar sederhana, 1-2 kalimat),
          "reason": string[] (Alasan simpel tanpa istilah teknis),
          "warning": string (Pesan waspada simpel)
        }
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING },
            signal: { type: Type.STRING, enum: ["BUY", "SELL", "WATCH", "HIGH_RISK"] },
            confidence: { type: Type.NUMBER },
            trend: { type: Type.STRING, enum: ["bullish", "bearish", "sideways"] },
            market_mood: { type: Type.STRING },
            risk_level: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
            volume_condition: { type: Type.STRING },
            analysis: { type: Type.STRING },
            reason: { type: Type.ARRAY, items: { type: Type.STRING } },
            warning: { type: Type.STRING }
          },
          required: ["symbol", "signal", "confidence", "trend", "market_mood", "risk_level", "volume_condition", "analysis", "reason", "warning"]
        }
      }
    });

    const text = response.text || "{}";
    try {
      return JSON.parse(text);
    } catch (parseErr) {
      console.error("AI JSON Parse Error:", parseErr, text);
      return null;
    }
  } catch (err) {
    console.error("Gemini Error:", err);
    return null;
  }
}

// Helper: Send Telegram Notification
async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("Telegram credentials missing. Skipping notification.");
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

// In-memory alert and price store
interface Alert {
  id: string;
  symbol: string;
  price: number;
  type: string;
  timestamp: number;
  
  // AI Enhanced Fields
  signal: 'BUY' | 'SELL' | 'WATCH' | 'HIGH_RISK';
  confidence: number;
  trend: 'bullish' | 'bearish' | 'sideways';
  marketMood: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  volumeCondition: string;
  aiAnalysis: string;
  reasons: string[];
  warning: string;
}

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdate: number;
}

let alertHistory: Alert[] = [];
let livePrices: Record<string, PriceData> = {};

// Helper: Market Status & Sessions
function getMarketStatus() {
  const now = new Date();
  const hours = now.getUTCHours() + 7; // WIB
  const minutes = now.getUTCMinutes();
  const currentTime = hours + minutes / 60;
  const isWeekend = now.getUTCDay() === 0 || now.getUTCDay() === 6;
  
  let idxStatus: 'OPEN' | 'CLOSED' | 'BREAK' | 'PRE-OPEN' = 'CLOSED';
  let sessionName = 'Market Closed';

  if (!isWeekend) {
    if (currentTime >= 8.75 && currentTime < 9) {
      idxStatus = 'PRE-OPEN';
      sessionName = 'Sesi Pra-Pembukaan';
    } else if (currentTime >= 9 && currentTime < 12) {
      idxStatus = 'OPEN';
      sessionName = 'Sesi 1';
    } else if (currentTime >= 12 && currentTime < 13.5) {
      idxStatus = 'BREAK';
      sessionName = 'Istirahat Siang';
    } else if (currentTime >= 13.5 && currentTime < 16) {
      idxStatus = 'OPEN';
      sessionName = 'Sesi 2';
    }
  }

  const usOpen = !isWeekend && ((hours >= 20.5 && hours <= 24) || (hours >= 0 && hours < 3));

  // Determine market mood based on recent prices if available
  const symbols = Object.values(livePrices);
  const upCount = symbols.filter(s => s.changePercent > 0).length;
  const mood = symbols.length === 0 ? 'SIDEWAYS' : 
               (upCount / symbols.length > 0.6) ? 'BULLISH' : 
               (upCount / symbols.length < 0.4) ? 'BEARISH' : 'SIDEWAYS';

  return {
    idx: idxStatus,
    global: usOpen ? 'OPEN' : 'CLOSED',
    session: sessionName,
    timeWIB: now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }),
    engine: {
      status: 'ONLINE',
      lastScan: now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }),
      watchedSymbols: WATCHLIST.length,
      signalsToday: alertHistory.filter(a => new Date(a.timestamp).toDateString() === now.toDateString()).length,
      marketMood: mood,
      latency: Math.floor(Math.random() * 50) + 150 // simulated latency
    }
  };
}

// Configuration for tracking
const WATCHLIST = [
  // INDONESIA (Major & LQ45)
  "BBCA.JK", "TLKM.JK", "ASII.JK", "GOTO.JK", "BBRI.JK", "BMRI.JK", "BBNI.JK", "UNVR.JK",
  "ADRO.JK", "PGAS.JK", "ANTM.JK", "INCO.JK", "TOWR.JK", "MDKA.JK", "KLBF.JK", "CPIN.JK",
  "ICBP.JK", "INDF.JK", "SMGR.JK", "INKP.JK", "BRPT.JK", "TPIA.JK", "AMRT.JK", "UNTR.JK",
  "ITMG.JK", "PTBA.JK", "HRUM.JK", "MEDC.JK", "ADMR.JK", "AKRA.JK", "SCMA.JK", "MNCN.JK",
  "BUKA.JK", "BRMS.JK", "DEWA.JK", "BUMI.JK", "ENRG.JK", "ACES.JK", "ERAA.JK", "WIFI.JK",
  "BTPS.JK", "BBTN.JK", "ARTO.JK", "BSDE.JK", "PWON.JK", "CTRA.JK", "SMRA.JK", "JSMR.JK",
  
  // GLOBAL
  "AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "NFLX", "AMD", "BTC-USD", "ETH-USD"
];

// Helper: Fetch Live Quotes in Batches
async function updateLivePrices() {
  try {
    const CHUNK_SIZE = 20;
    for (let i = 0; i < WATCHLIST.length; i += CHUNK_SIZE) {
      const chunk = WATCHLIST.slice(i, i + CHUNK_SIZE);
      const quotes = (await yahoo.quote(chunk)) as any[];
      
      quotes.forEach((q: any) => {
        if (!q || !q.symbol) return;
        livePrices[q.symbol] = {
          symbol: q.symbol,
          price: q.regularMarketPrice || 0,
          change: q.regularMarketChange || 0,
          changePercent: q.regularMarketChangePercent || 0,
          currency: q.currency || 'IDR',
          lastUpdate: Date.now()
        };
      });
      // Small pause between chunks to be safe
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (err) {
    console.error("Error updating live prices:", err);
  }
}

// Logic: Market Monitor (Indicator Analysis with spread-out requests)
async function monitorMarkets() {
  console.log(`Analyzing technical indicators for ${WATCHLIST.length} symbols...`);
  
  for (const symbol of WATCHLIST) {
    try {
      const history = (await yahoo.historical(symbol, { 
        period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })) as any[];
      
      if (!history || history.length < 20) {
        continue;
      }

      const closes = history.map(h => h.close).filter((c): c is number => typeof c === 'number');
      const volumes = history.map(h => h.volume).filter((v): v is number => typeof v === 'number');
      
      if (closes.length < 20) continue;

      const lastPrice = closes[closes.length - 1];
      const prevPrice = closes[closes.length - 2];

      const rsiValues = RSI.calculate({ values: closes, period: 14 });
      const lastRSI = rsiValues[rsiValues.length - 1];

      const sma20Values = SMA.calculate({ values: closes, period: 20 });
      const lastSMA20 = sma20Values[sma20Values.length - 1];

      const avgVolume20 = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
      const lastVolume = volumes[volumes.length - 1];

      let alertType = "";
      let alertMsg = "";
      let shouldCallAI = false;

      // Refined Technical Filters before calling AI
      if (lastPrice > lastSMA20 && prevPrice <= lastSMA20 && lastVolume > avgVolume20 * 1.5) {
        alertType = "BREAKOUT";
        alertMsg = `🚀 *Breakout SMA 20* on ${symbol}\nPrice: ${lastPrice.toFixed(2)}`;
        shouldCallAI = true;
      } else if (lastRSI < 30) {
        alertType = "OVERSOLD";
        alertMsg = `📉 *Oversold Detect* on ${symbol}\nRSI: ${lastRSI.toFixed(1)}\nPrice: ${lastPrice.toFixed(2)}`;
        shouldCallAI = lastVolume > avgVolume20 * 1.2; // Only call AI if volume is decent
      } else if (lastVolume > avgVolume20 * 2.5) {
        alertType = "VOL_SPIKE";
        alertMsg = `🔥 *Volume Spike* on ${symbol}\nVolume: ${(lastVolume / 1e6).toFixed(1)}M (Avg: ${(avgVolume20 / 1e6).toFixed(1)}M)`;
        shouldCallAI = true;
      }

      if (alertType && shouldCallAI) {
        // Double check for duplicates (same symbol + same type in last hour)
        const recentDuplicate = alertHistory.find(
          a => a.symbol === symbol && a.type === alertType && Date.now() - a.timestamp < 3600000
        );
        
        if (recentDuplicate) continue;

        console.log(`Generating AI analysis for ${symbol} (${alertType})...`);
        const aiResult = await getAIAnalysis({
          symbol,
          price: lastPrice,
          rsi: lastRSI,
          sma20: lastSMA20,
          volume: lastVolume,
          avgVolume20: avgVolume20,
          type: alertType
        });

        if (!aiResult) continue;

        const newAlert: Alert = {
          id: crypto.randomUUID(),
          symbol,
          price: lastPrice,
          type: alertType,
          timestamp: Date.now(),
          signal: aiResult.signal || 'WATCH',
          confidence: aiResult.confidence || 60,
          trend: aiResult.trend || 'sideways',
          marketMood: aiResult.market_mood || 'Neutral',
          riskLevel: aiResult.risk_level || 'MEDIUM',
          volumeCondition: aiResult.volume_condition || 'Normal',
          aiAnalysis: aiResult.analysis || 'Analysis pending...',
          reasons: aiResult.reason || [],
          warning: aiResult.warning || 'No specific warning.'
        };

        alertHistory.unshift(newAlert);
        alertHistory = alertHistory.slice(0, 50);
        await sendTelegram(`${alertMsg}\n\n*AI Analisis:* ${newAlert.aiAnalysis}\n\n*Mood:* ${newAlert.marketMood}\n*Confidence:* ${newAlert.confidence}%`);
      }
      
      // Delay to avoid Yahoo Finance rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (err) {
      console.error(`Error monitoring ${symbol}:`, err);
    }
  }
}

// API Routes
app.get("/api/alerts", (req, res) => {
  res.json(alertHistory);
});

app.get("/api/status", (req, res) => {
  res.json(getMarketStatus());
});

app.get("/api/prices", (req, res) => {
  res.json(livePrices);
});

app.get("/api/watchlist", (req, res) => {
  res.json(WATCHLIST);
});

// Start Loops
setInterval(monitorMarkets, 300000); // Technical analysis every 5 mins
setInterval(updateLivePrices, 15000); // Live price update every 15 secs
updateLivePrices(); 
monitorMarkets();

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MarketGuard AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
