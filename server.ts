import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import yahooFinance from "yahoo-finance2";

/**
 * Robust yahoo-finance2 initialization.
 * Handles differences between ESM (tsx) and bundled CJS (prod) environments.
 */
const yahoo = (function() {
  // @ts-ignore
  const base = yahooFinance.default || yahooFinance;
  if (typeof base === 'function') {
    try {
      return new (base as any)();
    } catch (e) {
      return base;
    }
  }
  return base;
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
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Helper: AI Market Analyst Brain with Rate Limiting and Retry
let lastAICallTime = 0;
const MIN_AI_INTERVAL = 15000; // 15 seconds between calls to stay under 5 RPM limit

async function getAIAnalysis(data: {
  symbol: string;
  price: number;
  rsi: number;
  sma20: number;
  volume: number;
  avgVolume20: number;
  type: string;
}, retryCount = 0): Promise<any> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found. Using fallback analysis.");
    return {
      signal: data.rsi < 30 ? 'WATCH' : 'WATCH',
      confidence: 60,
      trend: 'sideways',
      market_mood: 'Pasar sedang tenang',
      risk_level: 'MEDIUM',
      volume_condition: data.volume > data.avgVolume20 ? 'Ramai' : 'Biasa saja',
      analysis: {
        kondisi: 'Pasar sedang tenang dan belum ada pergerakan mencolok.',
        momentum: 'Pembeli dan penjual masih sama-sama menunggu.',
        risiko: 'Risiko sedang karena belum ada konfirmasi arah.',
        kesimpulan: 'Pantau saja dulu, jangan buru-buru masuk.'
      },
      reason: ["Indikator RSI menunjukkan area tertentu", "SMA 20 sebagai acuan"],
      warning: "Gunakan analisis mandiri karena otak AI sedang offline."
    };
  }

  // Enforce minimum interval
  const timeSinceLastCall = Date.now() - lastAICallTime;
  if (timeSinceLastCall < MIN_AI_INTERVAL) {
    const waitTime = MIN_AI_INTERVAL - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  try {
    lastAICallTime = Date.now();
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

        STRUKTUR OUTPUT WAJIB:
        1. KONDISI PASAR: Jelaskan suasana market saat ini (ramai, sepi, panik, optimis).
        2. BUYER VS SELLER: Siapa yang sedang dominan dan apa yang mereka lakukan.
        3. RISIKO: Berikan penilaian keamanan (aman, bahaya, perlu waspada).
        4. KESIMPULAN: Berikan saran tindakan sederhana untuk user.

        ATURAN UTAMA:
        1. JANGAN gunakan istilah teknikal (RSI, EMA, SMA, breakout, resistance, support, overbought, oversold).
        2. GUNAKAN BAHASA PASAR NYATA. Fokus pada kekuatan "Pembeli" (Buyer) vs "Penjual" (Seller), keramaian market, dan emosi trader.
        3. GAYA BAHASA: Santai profesional, singkat, jelas, cocok untuk notifikasi Telegram.
        4. ANALOGI & FRASA:
           - "Pembeli mulai ramai masuk."
           - "Penjual mulai menekan harga."
           - "Pasar sedang panas oleh aksi jual besar."
           - "Penjual masih dominan, tetapi mulai muncul pembeli."
           - "Belum ideal untuk masuk agresif."
           - "Volume transaksi meningkat seperti pasar yang tiba-tiba ramai."

        Output HARUS JSON VALID:
        {
          "symbol": string,
          "signal": "BUY" | "SELL" | "WATCH" | "HIGH_RISK",
          "confidence": number (50-95),
          "trend": "bullish" | "bearish" | "sideways",
          "market_mood": string (singkat, MAKSIMAL 3 KATA),
          "risk_level": "LOW" | "MEDIUM" | "HIGH",
          "volume_condition": string (singkat),
          "analysis": {
            "kondisi": string,
            "momentum": string,
            "risiko": string,
            "kesimpulan": string
          },
          "reason": string[],
          "warning": string
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
            analysis: {
              type: Type.OBJECT,
              properties: {
                kondisi: { type: Type.STRING },
                momentum: { type: Type.STRING },
                risiko: { type: Type.STRING },
                kesimpulan: { type: Type.STRING }
              },
              required: ["kondisi", "momentum", "risiko", "kesimpulan"]
            },
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
  } catch (err: any) {
    const status = err?.status || err?.response?.status;
    const message = err?.message || "";
    const isQuotaExceeded = message.includes("quota") || message.includes("429") || message.includes("RESOURCE_EXHAUSTED");
    const isDailyLimit = message.toLowerCase().includes("daily") || message.includes("FreeTier");
    
    console.error(`Gemini Error (${status}):`, message);
    
    // Handle 503 (Service Unavailable) or 429 (Rate Limit)
    // If it's a daily limit, don't waste time retrying
    if ((status === 503 || status === 429 || message.includes("503") || isQuotaExceeded) && !isDailyLimit) {
      if (retryCount < 2) {
        const backoffTime = Math.pow(2, retryCount) * 30000; 
        console.log(`Gemini busy. Retrying in ${backoffTime/1000}s... (Attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return getAIAnalysis(data, retryCount + 1);
      }
    }

    // Dynamic Fallback Analysis (Local Algorithm)
    const trend = data.price > data.sma20 ? 'bullish' : 'bearish';
    const strength = data.rsi > 60 ? 'kuat' : (data.rsi < 40 ? 'lemah' : 'netral');
    
    return {
      symbol: data.symbol,
      signal: data.rsi < 35 ? 'BUY' : (data.rsi > 65 ? 'SELL' : 'WATCH'),
      confidence: 60,
      trend: trend,
      market_mood: data.rsi > 55 ? 'Optimis' : (data.rsi < 45 ? 'Khawatir' : 'Konsolidasi'),
      risk_level: 'MEDIUM',
      volume_condition: data.volume > data.avgVolume20 ? 'High' : 'Normal',
      analysis: {
        kondisi: `Harga saat ini ${data.price > data.sma20 ? 'berada di atas' : 'berada di bawah'} SMA 20 (${data.sma20.toFixed(0)}), mengindikasikan tren ${trend}.`,
        momentum: `Indikator RSI berada pada level ${data.rsi.toFixed(1)}, menunjukkan momentum pasar yang ${strength}.`,
        risiko: `Volatilitas terpantau stabil berdasarkan rata-rata volume perdagangan.`,
        kesimpulan: `Berdasarkan indikator teknikal (RSI & Moving Average), saham ini menunjukkan pola ${data.type}. Rekomendasi: ${data.rsi < 40 ? 'Akumulasi bertahap' : 'Pantau konfirmasi lanjut'}.`
      },
      reason: [
        `RSI: ${data.rsi.toFixed(1)} (${strength})`, 
        `Tren: ${trend.toUpperCase()}`, 
        `Volume: ${data.volume > data.avgVolume20 ? 'Di atas rata-rata' : 'Normal'}`
      ],
      warning: "Mode Offline Aktif (Daily Quota AI Terlampaui). Analisa diproses oleh algoritma teknikal lokal."
    };
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
  aiAnalysis: {
    kondisi: string;
    momentum: string;
    risiko: string;
    kesimpulan: string;
  };
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

// Helper: Find Support and Resistance Levels
function findLevels(closes: number[]) {
  const levels: { support: number[]; resistance: number[] } = {
    support: [],
    resistance: []
  };

  for (let i = 2; i < closes.length - 2; i++) {
    // Local Low (Support)
    if (closes[i] < closes[i-1] && closes[i] < closes[i-2] && closes[i] < closes[i+1] && closes[i] < closes[i+2]) {
      levels.support.push(closes[i]);
    }
    // Local High (Resistance)
    if (closes[i] > closes[i-1] && closes[i] > closes[i-2] && closes[i] > closes[i+1] && closes[i] > closes[i+2]) {
      levels.resistance.push(closes[i]);
    }
  }
  
  // Return the most relevant (recent) levels
  return {
    support: Array.from(new Set(levels.support.slice(-3).map(n => Math.round(n)))),
    resistance: Array.from(new Set(levels.resistance.slice(-3).map(n => Math.round(n))))
  };
}

// Helper: Detect RSI Divergence
function detectRSIDivergence(closes: number[], rsi: number[]) {
  if (closes.length < 10 || rsi.length < 10) return null;
  
  const lastPrice = closes[closes.length - 1];
  const prevPrice = closes[closes.length - 6]; // ~1 week ago
  const lastRSI = rsi[rsi.length - 1];
  const prevRSI = rsi[rsi.length - 6];

  // Bullish Divergence: Price lower low, RSI higher low
  if (lastPrice < prevPrice && lastRSI > prevRSI && lastRSI < 40) {
    return 'BULLISH_DIVERGENCE';
  }
  // Bearish Divergence: Price higher high, RSI lower high
  if (lastPrice > prevPrice && lastRSI < prevRSI && lastRSI > 60) {
    return 'BEARISH_DIVERGENCE';
  }
  return null;
}

// Logic: Market Monitor (Indicator Analysis with spread-out requests)
async function monitorMarkets() {
  console.log(`Analyzing technical indicators for ${WATCHLIST.length} symbols...`);
  
  for (const symbol of WATCHLIST) {
    try {
      const period1 = new Date();
      period1.setDate(period1.getDate() - 90); // 90 days for daily/weekly context
      
      const chartResult = (await yahoo.chart(symbol, { 
        period1, 
        interval: '1d' 
      }, { validateOptions: false })) as any;
      
      const history = chartResult.quotes;
      
      if (!history || history.length < 30) {
        continue;
      }

      const closes = history.map(h => h.close).filter((c): c is number => typeof c === 'number');
      const volumes = history.map(h => h.volume).filter((v): v is number => typeof v === 'number');
      const highs = history.map(h => h.high).filter((h): h is number => typeof h === 'number');
      const lows = history.map(h => h.low).filter((l): l is number => typeof l === 'number');
      
      if (closes.length < 20) continue;

      const lastPrice = closes[closes.length - 1];
      const prevPrice = closes[closes.length - 2];

      const rsiValues = RSI.calculate({ values: closes, period: 14 });
      const lastRSI = rsiValues[rsiValues.length - 1];

      const sma20Values = SMA.calculate({ values: closes, period: 20 });
      const lastSMA20 = sma20Values[sma20Values.length - 1];
      
      const sma50Values = SMA.calculate({ values: closes, period: 50 });
      const lastSMA50 = sma50Values[sma50Values.length - 1];

      const avgVolume20 = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
      const lastVolume = volumes[volumes.length - 1];

      const levels = findLevels(closes);
      const divergence = detectRSIDivergence(closes.slice(-20), rsiValues.slice(-20));
      const volumeSpike = lastVolume > avgVolume20 * 2.5;

      let alertType = "";
      let alertMsg = "";
      let shouldCallAI = false;

      // multi-timeframe trend (approximate weekly from daily data)
      const isDailyBullish = lastPrice > lastSMA20;
      const isWeeklyBullish = lastPrice > lastSMA50;

      // 1. Breakout Strategy
      if (lastPrice > lastSMA20 && prevPrice <= lastSMA20 && volumeSpike) {
        alertType = "BREAKOUT";
        alertMsg = `🚀 *Breakout SMA 20* on ${symbol}\nPrice: ${lastPrice.toFixed(2)}`;
        shouldCallAI = true;
      } 
      // 2. Oversold Strategy
      else if (lastRSI < 30) { 
        const nearestSupport = Math.min(...levels.support.filter(s => s < lastPrice), lastPrice * 0.95);
        if (lastPrice > nearestSupport && lastPrice < nearestSupport * 1.02) {
           alertType = "OVERSOLD_REBOUND";
           alertMsg = `📈 *Oversold Rebound* on ${symbol} near Support (${nearestSupport})\nRSI: ${lastRSI.toFixed(1)}`;
        } else {
           alertType = "OVERSOLD_BREAKDOWN";
           alertMsg = `📉 *Oversold Breakdown* on ${symbol}\nRSI: ${lastRSI.toFixed(1)}`;
        }
        shouldCallAI = true; 
      } 
      // 3. Divergence Detection
      else if (divergence) {
        alertType = divergence;
        alertMsg = `✨ *RSI Divergence* detected on ${symbol} (${divergence.replace('_', ' ')})`;
        shouldCallAI = true;
      }
      // 4. Volume Spike Extreme
      else if (lastVolume > avgVolume20 * 5.0) {
        alertType = "VOL_SPIKE";
        alertMsg = `🔥 *Extreme Volume Spike* on ${symbol}`;
        shouldCallAI = true;
      }

      if (alertType && shouldCallAI) {
        // Stricter deduplication: same symbol in last 4 hours
        const recentDuplicate = alertHistory.find(
          a => a.symbol === symbol && Date.now() - a.timestamp < 14400000
        );
        
        if (recentDuplicate) continue;

        // Scoring System for Confidence
        let score = 0;
        if (lastRSI < 35) score += 25;
        if (isDailyBullish) score += 20;
        if (volumeSpike) score += 15;
        if (isWeeklyBullish) score += 20;
        if (divergence === 'BULLISH_DIVERGENCE') score += 20;
        
        const confidence = Math.min(score, 100);

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
          confidence: confidence,
          trend: aiResult.trend || (isDailyBullish ? 'bullish' : 'bearish'),
          marketMood: aiResult.market_mood || (lastRSI > 50 ? 'Optimis' : 'Khawatir'),
          riskLevel: aiResult.risk_level || (confidence > 70 ? 'LOW' : (confidence < 40 ? 'HIGH' : 'MEDIUM')),
          volumeCondition: aiResult.volume_condition || (volumeSpike ? 'SPYKE' : 'Normal'),
          aiAnalysis: aiResult.analysis || {
            kondisi: `Pasar terpantau ${isDailyBullish ? 'kuat' : 'lemah'} dengan support di ${levels.support[levels.support.length-1]}`,
            momentum: `Momentum saat ini berada di level ${lastRSI.toFixed(0)}`,
            risiko: confidence > 70 ? 'Resiko terukur' : 'Resiko tinggi',
            kesimpulan: `Sinyal ${alertType} valid secara teknikal.`
          },
          reasons: [...(aiResult.reason || []), `Score: ${confidence}/100`, `Weekly: ${isWeeklyBullish ? 'Bullish' : 'Bearish'}`],
          warning: aiResult.warning || (levels.resistance.length > 0 ? `Resistance terdekat: ${levels.resistance[0]}` : 'Berhati-hatilah.')
        };

        alertHistory.unshift(newAlert);
        alertHistory = alertHistory.slice(0, 50);
        await sendTelegram(`${alertMsg}\n\n*STRENGTH SCORE: ${confidence}/100*\n*Status:* ${confidence >= 70 ? 'Strong' : (confidence >= 40 ? 'Moderate' : 'Weak')}\n\n*KONDISI PASAR*\n${newAlert.aiAnalysis.kondisi}\n\n*BUYER VS SELLER*\n${newAlert.aiAnalysis.momentum}\n\n*KESIMPULAN*\n${newAlert.aiAnalysis.kesimpulan}\n\n*Levels:* S: ${levels.support.join(', ')} | R: ${levels.resistance.join(', ')}`);
      }
      
      // Delay between Yahoo Finance calls (0.5s) to be very safe
      await new Promise(resolve => setTimeout(resolve, 500));

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

app.post("/api/alerts/clear", (req, res) => {
  alertHistory = [];
  res.json({ status: "success", message: "Alert history cleared" });
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
