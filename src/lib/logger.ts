interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: any;
}

class Logger {
  private logs: LogEntry[] = [];

  private log(level: LogEntry['level'], message: string, meta?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta
    };
    
    this.logs.push(entry);
    console[level](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, meta || '');
    
    // Keep only last 100 logs in memory
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  getLogs() {
    return this.logs;
  }

  getRecentErrors() {
    return this.logs.filter(log => log.level === 'error').slice(-10);
  }
}

export const logger = new Logger();