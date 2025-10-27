import app from './app'
import redisClient, { Redis } from './common/redis';
import Logger from './common/logger';
import http from 'http';
import { MongoDB } from './common/mongo';
import { initializeProcessEvents, addShutdownHandler } from './common/events';
import { getEnvOrThrow } from './common/util';

const logger = new Logger("server");
const PORT = getEnvOrThrow("PORT") as unknown as number;
const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

let server: http.Server;
let isShuttingDown = false;

async function startServer() {
  try {
    // Set security timeouts
    const timeoutConfig = {
      headersTimeout: 60 * 1000, // 60 seconds
      keepAliveTimeout: 30 * 1000, // 30 seconds
    };

    // Initialize process events
    initializeProcessEvents();

    // Parallel database connections
    await Promise.all([
      MongoDB(),
      Redis()
    ]);

    server = app.listen(PORT, '::', () => {
      logger.info(`Server started in ${process.env.NODE_ENV || 'development'} mode ⚡`, { 
        port: PORT || 5200,
        pid: process.pid
      });
    });

    server.timeout = timeoutConfig.headersTimeout;
    server.keepAliveTimeout = timeoutConfig.keepAliveTimeout;

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          logger.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
        case 'EADDRINUSE':
          logger.error(`Port ${PORT} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    });

  } catch (error) {
    logger.error("Failed to start server", { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  }
}

async function gracefulShutdown(signal?: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info('Received shutdown signal', { signal });

  // Create a timeout to force shutdown
  const forceShutdown = setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  try {
    // Stop accepting new connections
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }

    // Cleanup
    logger.info('Cleaning up resources...');
    await redisClient.quit();
    
    // Clear force shutdown timeout
    clearTimeout(forceShutdown);
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    process.exit(1);
  }
}

// Add shutdown handler
addShutdownHandler(() => gracefulShutdown('SIGTERM'));

// Start server
startServer();