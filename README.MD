# Pomodoro CLI

A CLI-based Pomodoro timer with history, stats, and trends.

## Description

This project provides a command-line interface (CLI) tool for managing Pomodoro sessions. It allows you to start a Pomodoro session, view past sessions, and see trends in your work time.

## Features

- Start a Pomodoro session with customizable work and break durations.
- View history of past Pomodoro sessions.
- Export history as CSV or Markdown.
- Show a trend chart of daily Pomodoro work time.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pomodoro-cli.git cd pomodoro-cli
```

2. Install dependencies:

```bash
npm install 
```

3. Link the package globally (optional, for easier access):
   
```bash
npm link
```   

## Usage

### Start a Pomodoro Session

```bash
  pomodoro start [-w, --work <time>] [-b, --break <time>] [--label <tag>]
```

- `-w, --work <time>`: Set the work duration (default: 25:00).
- `-b, --break <time>`: Set the break duration (default: 5:00).
- `--label <tag>`: Optional tag/label for the session.

### View History

```bash
pomodoro history [--csv] [--md]
```

- `--csv`: Export history as CSV.
- `--md`: Export history as Markdown.

### Show Trends

```bash
pomodoro trend
```

## Dependencies

- `asciichart`
- `chalk`
- `commander`
- `date-fns`
- `node-notifier`
- `ora`

## License

This project is licensed under the MIT License.

## Author

- Jason Zhao
