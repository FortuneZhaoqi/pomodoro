import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { format } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'pomodoros.json');

function loadHistory() {
  if (!fs.existsSync(DATA_FILE)) return [];

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function secondsToHuman(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function exportCSV(sessions) {
  const headers = [
    'Start Time',
    'End Time',
    'Work Duration',
    'Break Duration',
    'Work (sec)',
    'Break (sec)',
  ];

  const rows = sessions.map(s => [
    s.startedAt,
    s.endedAt,
    s.workDurationFormatted,
    s.breakDurationFormatted,
    s.workSeconds,
    s.breakSeconds,
  ]);
  return [headers, ...rows].map(r => r.join(',')).join('\n');
}

function exportMarkdown(sessions) {
  const headers = `| Start Time | Work | Break |\n|-----------------|------|------|`;
  const rows = sessions.map(s => `| ${format(new Date(s.startedAt), 'yyyy-MM-dd HH:mm')} | ${s.workDurationFormatted} | ${s.breakDurationFormatted} |`);
  return [headers, ...rows].join('\n');
}

export function showHistory(options) {
  const sessions = loadHistory();

  if (sessions.length === 0) {
    console.log('No Pomodoro history found.');
    return;
  }

  // Summary
  const totalWorkSeconds = sessions.reduce((sum, s) => sum + (s.workSeconds || 0), 0);
  const totalBreakSeconds = sessions.reduce((sum, s) => sum + (s.breakSeconds || 0), 0);
  const totalSessions = sessions.length;

  console.log(`📈 Pomodoro Summary`);
  console.log(`-------------------`);
  console.log(`Total Sessions: ${ totalSessions }`);
  console.log(`Total Work Time: ${ secondsToHuman(totalWorkSeconds) }`);
  console.log(`Total Break Time: ${ secondsToHuman(totalBreakSeconds) }`);

  if (options.csv) {
    const csv = exportCSV(sessions);
    const outPath = path.join(__dirname, '..', 'data', 'history.csv');
    fs.writeFileSync(outPath, csv);
    console.log(`✅ CSV exported to ${outPath}`);
  } else if (options.md) {
    const md = exportMarkdown(sessions);
    const outPath = path.join(__dirname, '..', 'data', 'history.md');
    fs.writeFileSync(outPath, md);
    console.log(`✅ Markdown exported to ${outPath}`);
  } else {
    // Print table to terminal
    sessions.slice(-10).reverse().forEach((s, i) => {
      const time = format(new Date(s.startedAt), 'yyyy-MM-dd HH:mm');
      console.log(
        `#${totalSessions - i} ${time} | Work: ${s.workDurationFormatted} | Break: ${s.breakDurationFormatted}`
      )
    })
  }
}
