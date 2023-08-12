interface Logger {
  setPrefix(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  error(...args: any[]): void;
}
