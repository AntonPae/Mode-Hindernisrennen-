import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });
}

function buildNpcSystemInstruction(target: any, context: any): string {
  const name = target?.name || 'Nachbar';
  const role = target?.role || 'Bewohner/in der Traumstadt';
  const hobby = target?.hobby || '';
  const favFood = target?.favoriteFood || '';
  const spotLabel = target?.spotLabel || 'Traumstadt';
  const facts = Array.isArray(target?.facts) ? target.facts.join(' ') : '';
  const isRoommate = Boolean(context?.isRoommate);
  const hasOwnRoom = Boolean(context?.hasOwnRoom);
  const rmLife = context?.roommateLife || null;
  const playerNeeds = context?.playerNeeds || null;
  const scene = context?.scene || 'town';

  const lifeLines: string[] = [];
  if (isRoommate && rmLife) {
    lifeLines.push(
      `WG-Zustand von ${name}: Aktivität="${rmLife.activity || 'idle'}", ` +
      `Hunger=${Math.round(rmLife.hunger ?? 75)}%, Durst=${Math.round(rmLife.thirst ?? 75)}%, ` +
      `Energie=${Math.round(rmLife.energy ?? 85)}%, ` +
      `Gesundheit=${rmLife.sick ? `krank (${rmLife.sick.label})` : 'kerngesund'}, ` +
      `Eigenes WG-Zimmer=${hasOwnRoom ? 'ja, du hast ein eigenes Zimmer gekauft!' : 'noch kein eigenes Zimmer (kann im Möbel- & Bau-Kaufhaus gekauft werden)'}.`
    );
  }
  if (playerNeeds) {
    lifeLines.push(
      `Spieler-Zustand: Sättigung=${Math.round(playerNeeds.hunger ?? 70)}%, ` +
      `Durst=${Math.round(playerNeeds.thirst ?? 75)}%, Energie=${Math.round(playerNeeds.energy ?? 85)}%` +
      `${context?.playerSick ? `, Spieler ist gerade erkältet (${context.playerSick.label})` : ''}.`
    );
  }
  if (Array.isArray(context?.pets) && context.pets.length > 0) {
    lifeLines.push(`Haustiere im Haushalt: ${context.pets.join(', ')}.`);
  }

  return [
    `Du spielst ${name} (${role}) in dem freundlichen Lebensspiel „DreamRunner Studio & Mein Traumhaus“ (in der bunten Traumstadt).`,
    `Sprache: Antworte IMMER auf natürlichem, herzlichem Deutsch (duzen, 1 bis 3 klare, direkte Sätze, familienfreundlich, maximal 1–2 passende Emojis).`,
    hobby ? `Dein Hobby: ${hobby}.` : '',
    favFood ? `Dein Lieblingsessen/-getränk: ${favFood}.` : '',
    facts ? `Hintergrund über dich: ${facts}` : '',
    `Aktueller Ort: Szene "${scene}" (dein Stammplatz in der Stadt: ${spotLabel}).`,
    isRoommate
      ? `WICHTIG: Du wohnst BEREITS fest mit der Spielerin / dem Spieler in ihrem Traumhaus als Mitbewohner/in zusammen! Stell dich also NICHT nochmal mit „Ich bin ${name}“ vor, sondern rede wie ein eingespielter, lieber WG-Mitbewohner, der hier lebt, isst, trinkt, arbeitet, schläft und auch mal krank werden kann.`
      : `Ihr seid euch in der Traumstadt / bei einem Ausflug begegnet und lernt euch kennen (oder seid schon Freunde). Wenn dich der Spieler fragt, ob ihr zusammenziehen wollt (oder in dein Haus einziehen), sag begeistert Ja (agreesToMoveIn: true)!`,
    `WICHTIGSTE REGEL: Lies die genaue Frage oder Nachricht des Spielers aufmerksam und antworte DIREKT, konkret und sinnvoll auf genau diese Frage! Weiche nicht auf allgemeine Floskeln aus. Wenn der Spieler etwas zu deinem Zimmer, Arbeit, Essen, Trinken, Schlafen, Gesundheit, Farben, Tieren oder Alltag fragt, gib eine passende, lebendige Antwort als ${name}.`,
    ...lifeLines
  ].filter(Boolean).join('\n');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '512kb' }));

  app.post('/api/npc-chat', async (req: Request, res: Response) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY ist auf dem Server noch nicht konfiguriert.',
        code: 'MISSING_API_KEY'
      });
      return;
    }

    const { target, person, message, history, context } = req.body || {};
    const reqTarget = target || person || {};
    const cleanMessage = typeof message === 'string' ? message.trim() : '';
    if (!cleanMessage) {
      res.status(400).json({ error: 'Nachricht darf nicht leer sein.', code: 'EMPTY_MESSAGE' });
      return;
    }

    const formattedHistory = Array.isArray(history)
      ? history
          .slice(-8)
          .filter((m: any) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string' && m.text.trim())
          .map((m: any) => ({
            role: m.role,
            parts: [{ text: m.text.trim() }]
          }))
      : [];

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: cleanMessage }] }
    ];

    const sysInstruction = buildNpcSystemInstruction(reqTarget, context);
    const modelCandidates = ['gemini-4-hydrogen', 'gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (let i = 0; i < modelCandidates.length; i++) {
      const modelName = modelCandidates[i];
      try {
        const reqConfig: any = {
          systemInstruction: sysInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Die direkte, freundliche deutsche Antwort des Charakters auf die Frage des Spielers (1-3 Sätze).'
              },
              agreesToMoveIn: {
                type: Type.BOOLEAN,
                description: 'True NUR, wenn der Spieler gefragt hat ob ihr zusammenziehen/einziehen wollt und der Charakter noch nicht Mitbewohner ist.'
              }
            },
            required: ['reply', 'agreesToMoveIn']
          }
        };
        if (modelName === 'gemini-4-hydrogen') {
          reqConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: reqConfig
        });

        const rawText = (response.text || '').trim();
        let parsed: { reply?: string; agreesToMoveIn?: boolean } = {};
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = { reply: rawText, agreesToMoveIn: false };
        }

        const reply = (parsed.reply || '').trim();
        if (!reply) {
          lastError = new Error('Leere Antwort vom Sprachmodell erhalten.');
          continue;
        }

        res.json({
          reply,
          agreesToMoveIn: Boolean(parsed.agreesToMoveIn)
        });
        return;
      } catch (err: any) {
        lastError = err;
        const status = typeof err?.status === 'number' ? err.status : 500;
        const isTransient = status === 503 || status === 429 || String(err?.message || '').includes('UNAVAILABLE');
        console.warn(`[npc-chat] ${modelName} attempt ${i + 1} failed (${status}):`, err?.message || err);
        if (isTransient && i < modelCandidates.length - 1) {
          await new Promise((r) => setTimeout(r, 350));
          continue;
        }
        break;
      }
    }

    const status = typeof lastError?.status === 'number' ? lastError.status : 503;
    const friendlyErr = status === 503 || String(lastError?.message || '').includes('UNAVAILABLE')
      ? 'Der Gesprächs-Server ist gerade stark ausgelastet – bitte versuche es gleich noch einmal!'
      : 'Die Antwort konnte gerade nicht geladen werden. Bitte versuche es gleich noch einmal!';
    res.status(status >= 400 && status < 600 ? status : 503).json({
      error: friendlyErr,
      code: 'GEMINI_UPSTREAM_ERROR'
    });
  });

  if (!IS_PROD) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      if (fs.existsSync(path.join(distDir, 'index.html'))) {
        res.sendFile(path.join(distDir, 'index.html'));
      } else {
        res.status(500).send('Build output missing. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
