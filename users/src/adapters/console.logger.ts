type ConsoleLogMethod = 'debug' | 'info' | 'error';

export class ConsoleLogger implements Logger {
  private prefix: any[];

  setPrefix(...args: any[]): void {
    this.prefix = args;
  }

  debug(...args: any[]): void {
    this.log('debug', ...args);
  }

  info(...args: any[]): void {
    this.log('info', ...args);
  }

  error(...args: any[]): void {
    this.log('error', ...args);
  }

  private log(method: ConsoleLogMethod, ...args: any[]): void {
    console[method](Date.now(), 'users', ...this.prefix, ...args);
  }
}
