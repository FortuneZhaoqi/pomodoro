#!/usr/bin/env node

import { Command } from 'commander';
import { startTimer } from '../lib/timer.js';
import { parseTimeInput } from "../lib/time-utils.js";

const program = new Command();

program
  .name('pomodoro')
  .description('CLI Pomodoro Timer')
  .version('1.0.0')

program
  .command('start')
  .description('Start a Pomodoro session.')
  .option('-w, --work <time>', 'Work duration (hh:mm:ss or mm:ss or just seconds)', '25:00')
  .option('-b, --break <time>', 'Break duration (hh:mm:ss or mm:ss or just seconds)', '5:00')
  .option('--label <tag>', 'Optional tag/label for this session.')
  .action((options) => {
    console.log(`Starting Pomodoro: Work ${ options.work } seconds, Break ${ options.break } seconds`);

    try {
      const workSeconds = parseTimeInput(options.work);
      const breakSeconds = parseTimeInput(options.break);

      startTimer({
        workSeconds,
        breakSeconds,
        label: options.label || ''
      });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

program
  .command('history')
  .description('View past Pomodoro sessions and stats')
  .option('--csv', 'Export as CSV')
  .option('--md', 'Export as Markdown')
  .action((options) => {
    import('../lib/history.js').then(({ showHistory }) => {
      showHistory(options);
    });
  });

program
  .command('trend')
  .description('Show a trend chart of daily Pomodoro work time.')
  .action(() => {
    import('../lib/trends.js').then(({ showTrend }) => {
      showTrend();
    });
  });

program.parse(process.argv);
