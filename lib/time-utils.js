export function parseTimeInput(timeStr) {
  const parts = timeStr.split(':').map(Number);

  if (parts.some(isNaN)) {
    throw new Error(`Invalid time format: ${ timeStr }`);
  }

  let seconds = 0;

  if (parts.length === 1) {
    // just seconds
    seconds = parts[0];
  } else if (parts.length === 2) {
    // mm:ss
    const [min, sec] = parts;
    seconds = min * 60 + sec;
  } else if (parts.length === 3) {
    // hh:mm:ss
    const [hr, min, sec] = parts;
    seconds = hr * 3600 + min * 60 + sec;
  } else {
    throw new Error(`Unsupported time format: ${ timeStr }`);
  }

  return seconds;
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');
}