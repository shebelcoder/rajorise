import * as Sentry from "@sentry/nextjs";

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  action?: string;
  ip?: string;
  [key: string]: unknown;
}

/**
 * Structured logger — writes to console + Sentry.
 * In production, errors and warnings are captured by Sentry for alerting.
 */
export function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, level, message, ...context };

  // Console output (always)
  switch (level) {
    case "error":
      console.error(`[${timestamp}] ERROR: ${message}`, context || "");
      break;
    case "warn":
      console.warn(`[${timestamp}] WARN: ${message}`, context || "");
      break;
    default:
      console.log(`[${timestamp}] INFO: ${message}`, context || "");
  }

  // Sentry capture (errors + warnings only, if DSN is configured)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    if (level === "error") {
      Sentry.captureException(new Error(message), {
        extra: entry,
        tags: { action: context?.action },
      });
    } else if (level === "warn") {
      Sentry.captureMessage(message, {
        level: "warning",
        extra: entry,
        tags: { action: context?.action },
      });
    }
  }
}

/** Shorthand helpers */
export const logInfo = (msg: string, ctx?: LogContext) => log("info", msg, ctx);
export const logWarn = (msg: string, ctx?: LogContext) => log("warn", msg, ctx);
export const logError = (msg: string, ctx?: LogContext) => log("error", msg, ctx);
