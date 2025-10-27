import pino from 'pino';

// Singleton Pino instance to prevent multiple exit listeners
let sharedPinoLogger: pino.Logger | null = null;

const getSharedPinoLogger = (): pino.Logger => {
  if (!sharedPinoLogger) {
    const isDev = process.env.NODE_ENV !== 'production';
    
    sharedPinoLogger = pino({
      transport: isDev ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      } : undefined
    });
  }
  return sharedPinoLogger;
};

class Logger {
  private pinoLogger: pino.Logger;
  private name: string;

  constructor(service?: string) {
    this.name = service || 'service';
    this.pinoLogger = getSharedPinoLogger().child({ name: this.name });
  }

  info(message: string, data?: unknown) {
    this.pinoLogger.info({ data }, message);
  }

  error(message: string, data?: unknown) {
    this.pinoLogger.error({ data }, message);
  }
}

export default Logger;