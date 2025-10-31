const isDev = import.meta.env.DEV;

export const logger = {
  info: (message: string) => {
    if (isDev) {
      console.info(`[INFO] ${message}`);
    }
  },
  
  log: (message: string) => {
    if (isDev) {
      console.log(`[LOG] ${message}`);
    }
  },
  
  error: (message: string, error?: Error) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error);
    }
    // If I ever do error tracking it'd be here
  },
  
  warn: (message: string) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`);
    }
  },
  
  debug: (message: string) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`);
    }
  }
};