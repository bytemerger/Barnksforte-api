import Logger from './logger';

const logger = new Logger("events");

let isInitialized = false;

export const initializeProcessEvents = () => {
  if (isInitialized) return;
  isInitialized = true;

  // Remove any existing listeners
  process.removeAllListeners('unhandledRejection');
  process.removeAllListeners('uncaughtException');
  process.removeAllListeners('SIGTERM');
  process.removeAllListeners('SIGINT');

  // Add handlers
  process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection', {
      error: reason.message,
      stack: reason.stack
    });
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack
    });
  });
};

export const addShutdownHandler = (handler: () => Promise<void>) => {
  process.on('SIGTERM', handler);
  process.on('SIGINT', handler);
}; 