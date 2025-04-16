import ora from 'ora';
import chalk from 'chalk';
import { notify } from './notifier.js';
import readline from 'readline';
import { saveSession } from "./storage.js";
import { formatTime } from "./time-utils.js";

export function startTimer({ workSeconds = 1500, breakSeconds = 300, label }) {
  const startedAt = new Date().toISOString();

  let currentPhase = "work";
  let secondsLeft = workSeconds;
  let paused = false;
  let interval = null;

  const spinner = ora(`${chalk.green('Pomodoro started')}: ${formatTime(secondsLeft)}`).start();

  // Set up keypress listener
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
  }

  process.stdin.on('keypress', (str, key) => {
    if (key.name === 'p') {
      paused = !paused;
      if (paused) {
        clearInterval(interval);
        spinner.text = chalk.gray(`${currentPhase} puased at ${formatTime(secondsLeft)} (press 'p' to resume)`);
      } else {
        spinner.text = `${chalk.yellow(currentPhase)}: ${formatTime(secondsLeft)}`;
        startInterval();
      }
    }

    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      spinner.fail('Pomodoro session manually stopped.');
      process.exit();
    }
  });

  function startInterval() {
    interval = setInterval(() => {
      secondsLeft--;

      spinner.text = `${chalk.yellow(currentPhase)}: ${formatTime(secondsLeft)}`;

      if (secondsLeft <= 0) {
        notify(`${currentPhase} time is over!`);
        clearInterval(interval);

        if (currentPhase === "work") {
          currentPhase = "break";
          secondsLeft = breakSeconds;
          spinner.text = `${chalk.blue('Break started')}: ${formatTime(secondsLeft)}`;
          startInterval();
        } else {
          saveSession({ workSeconds, breakSeconds, startedAt, label: label || '' })
          spinner.succeed(chalk.green('Pomodoro session complete!'));
          process.exit();
        }
      }
    }, 1000);
  }

  startInterval();
}
