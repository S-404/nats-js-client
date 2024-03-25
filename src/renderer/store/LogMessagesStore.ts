import { makeAutoObservable } from 'mobx';

export type LoggerMessageType = {
  time: string;
  message: string;
  subject?: string;
  type: 'info' | 'warn' | 'error' | 'success'
}

class LogMessagesStore {

  logMessages: LoggerMessageType[];

  constructor() {
    this.logMessages = [];
    makeAutoObservable(this);
  }

  addLogMessage(message: LoggerMessageType) {
    this.logMessages.push(message);
    if (this.logMessages.length > 600) {
      this.logMessages = this.logMessages.slice(100);
    }
  }

  clear() {
    this.logMessages.length = 0;
  }
}

export default new LogMessagesStore();
