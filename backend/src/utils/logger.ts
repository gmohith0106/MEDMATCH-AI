type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function sanitize(message: string): string {
  // Strip sensitive credentials if present in strings
  return message
    .replace(/(Bearer\s+)[A-Za-z0-9-_=.]+/gi, '$1[REDACTED_TOKEN]')
    .replace(/("?private_?key"?\s*:\s*)"[^"]+"/gi, '$1"[REDACTED_KEY]"')
    .replace(/("?apiKey"?\s*:\s*)"[^"]+"/gi, '$1"[REDACTED_API_KEY]"')
    .replace(/("?secret"?\s*:\s*)"[^"]+"/gi, '$1"[REDACTED_SECRET]"');
}

function formatLog(level: LogLevel, message: string, meta?: unknown): string {
  const timestamp = new Date().toISOString();
  const safeMessage = sanitize(message);
  let metaString = '';

  if (meta !== undefined) {
    try {
      metaString = ' ' + sanitize(JSON.stringify(meta));
    } catch {
      metaString = ' [Unserializable Meta]';
    }
  }

  return `[${timestamp}] [${level.toUpperCase()}] ${safeMessage}${metaString}`;
}

export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(formatLog('info', message, meta));
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(formatLog('warn', message, meta));
  },
  error: (message: string, meta?: unknown) => {
    console.error(formatLog('error', message, meta));
  },
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', message, meta));
    }
  }
};
