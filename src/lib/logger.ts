import eventbus from './eventbus.ts';
import { LOGGER_ADD } from '#app/events/constants.ts';
import { timeString } from '#app/helpers/dateFormat.ts';

interface ILoggerProps {
  message: string;
  subject?: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export default function ({ type = 'info', message, subject }: ILoggerProps) {
  eventbus.emit(LOGGER_ADD, {
    time: timeString(),
    message,
    subject,
    type,
  });
}
