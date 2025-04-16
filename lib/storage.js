import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatTime } from "./time-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/pomodoros.json');

export function saveSession({ workSeconds, breakSeconds, startedAt }) {
  const endedAt = new Date().toISOString();

  const session = {
    startedAt,
    endedAt,
    workSeconds,
    breakSeconds,
    workDurationFormatted: formatTime(workSeconds),
    breakDurationFormatted: formatTime(breakSeconds)
  };

  let history = [];

  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
      history = JSON.parse(raw);
    } catch(err) {
      console.warn('⚠️ Could not parse pomodoros.json. Starting fresh.');
    }
  }

  history.push(session);

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(history, null, 2));
}
