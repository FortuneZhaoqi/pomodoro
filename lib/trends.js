import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import asciichart from 'asciichart';
import { format, parseISO } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'pomodoros.json');

export function showTrend() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log('No session data found.');
    return;
  }

  const sessions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  const dailyTotals = {};

  for (const s of sessions) {
    const day = format(parseISO(s.startedAt), 'yyyy-MM-dd');
    dailyTotals[day] = (dailyTotals[day] || 0) + (s.workSeconds || 0);
  }

  const sortedDays = Object.keys(dailyTotals).sort();
  const workSeries = sortedDays.map(d => Math.round(dailyTotals[d] / 60));

  console.log(`🟩 Pomodoro Work Time per Day (in minutes)`);
  console.log(asciichart.plot(workSeries, { height: 10 }));
  console.log(sortedDays.map((d, i) => `${i}: ${d}`).join('  '));
}