interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  tags?: string[];
}

interface LoggerConfig {
  minLevel: 'debug' | 'info' | 'warn' | 'error';
  maxEntries: number;
  persistLogs: boolean;
  remoteLogging: boolean;
  remoteEndpoint?: string;
}

interface LogQueryOptions {
  level?: LogEntry['level'];
  startTime?: string;
  endTime?: string;
  tags?: string[];
  search?: string;
}

class LoggerService {
  private logs: LogEntry[] = [];
  private config: LoggerConfig = {
    minLevel: import.meta.env.PROD ? 'info' : 'debug',
    maxEntries: 1000,
    persistLogs: true,
    remoteLogging: import.meta.env.PROD,
    remoteEndpoint: import.meta.env.VITE_LOG_ENDPOINT,
  };

  private readonly LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    this.loadPersistedLogs();
    window.addEventListener('unload', () => this.persistLogs());
  }

  private shouldLog(level: LogEntry['level']): boolean {
    return this.LOG_LEVELS[level] >= this.LOG_LEVELS[this.config.minLevel];
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context?: Record<string, unknown>,
    tags?: string[]
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      tags,
    };
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (this.config.remoteLogging && this.config.remoteEndpoint) {
      try {
        await fetch(this.config.remoteEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });
      } catch (error) {
        console.error('Failed to send log to remote:', error);
      }
    }
  }

  private addEntry(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.config.maxEntries) {
      this.logs.shift();
    }

    // Console output
    const consoleMethod = entry.level === 'debug' ? 'log' : entry.level;
    console[consoleMethod](
      `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
      entry.context || ''
    );

    // Remote logging
    void this.sendToRemote(entry);
  }

  debug(message: string, context?: Record<string, unknown>, tags?: string[]): void {
    if (this.shouldLog('debug')) {
      this.addEntry(this.createLogEntry('debug', message, context, tags));
    }
  }

  info(message: string, context?: Record<string, unknown>, tags?: string[]): void {
    if (this.shouldLog('info')) {
      this.addEntry(this.createLogEntry('info', message, context, tags));
    }
  }

  warn(message: string, context?: Record<string, unknown>, tags?: string[]): void {
    if (this.shouldLog('warn')) {
      this.addEntry(this.createLogEntry('warn', message, context, tags));
    }
  }

  error(message: string, context?: Record<string, unknown>, tags?: string[]): void {
    if (this.shouldLog('error')) {
      this.addEntry(this.createLogEntry('error', message, context, tags));
    }
  }

  query(options: LogQueryOptions): LogEntry[] {
    return this.logs.filter(entry => {
      if (options.level && entry.level !== options.level) return false;
      if (options.startTime && entry.timestamp < options.startTime) return false;
      if (options.endTime && entry.timestamp > options.endTime) return false;
      if (options.tags && !options.tags.some(tag => entry.tags?.includes(tag)))
        return false;
      if (
        options.search &&
        !entry.message.toLowerCase().includes(options.search.toLowerCase())
      )
        return false;
      return true;
    });
  }

  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(entry => entry.level === level);
  }

  getRecentLogs(count: number): LogEntry[] {
    return this.logs.slice(-count);
  }

  clear(): void {
    this.logs = [];
    if (this.config.persistLogs) {
      localStorage.removeItem('appLogs');
    }
  }

  private persistLogs(): void {
    if (this.config.persistLogs) {
      localStorage.setItem('appLogs', JSON.stringify(this.logs));
    }
  }

  private loadPersistedLogs(): void {
    if (this.config.persistLogs) {
      const persistedLogs = localStorage.getItem('appLogs');
      if (persistedLogs) {
        this.logs = JSON.parse(persistedLogs);
      }
    }
  }

  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new LoggerService(); 