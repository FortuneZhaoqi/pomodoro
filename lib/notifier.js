import notifier from 'node-notifier';

export function notify(message) {
  notifier.notify({
    title: 'Pomodoro Timer',
    message,
    sound: true
  });
}
