interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  component?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private addLog(level: LogEntry['level'], message: string, data?: any, component?: string) {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      component
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also output to console in development
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = `[${logEntry.timestamp.toISOString()}] ${level.toUpperCase()} - ${component ? `[${component}] ` : ''}${message}`;
      if (data) {
        console.log(formattedMessage, data);
      } else {
        console.log(formattedMessage);
      }
    }
  }

  info(message: string, data?: any, component?: string) {
    this.addLog('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.addLog('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string) {
    this.addLog('error', message, data, component);
  }

  debug(message: string, data?: any, component?: string) {
    this.addLog('debug', message, data, component);
  }

  getLogs(level?: LogEntry['level']): LogEntry[] {
    return level ? this.logs.filter(log => log.level === level) : this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
