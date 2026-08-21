import "server-only";

// Minimal structured server-side logging. Deliberately dependency-free
// (no pino/winston) — this app runs as a single Node process on a VPS where
// stdout/stderr is already captured by `docker logs` / systemd / pm2, so a
// JSON line per event is enough to grep or ship elsewhere later without
// adding a logging service now.
//
// Never pass passwords, session tokens, or full stack traces containing
// secrets into `meta` — callers are responsible for keeping it to
// non-sensitive identifiers (user id, email, route, error message).

type Level = "info" | "warn" | "error";

function write(level: Level, event: string, meta?: Record<string, unknown>) {
  const line = {
    time: new Date().toISOString(),
    level,
    event,
    ...meta,
  };
  const serialized = JSON.stringify(line);
  if (level === "error") {
    console.error(serialized);
  } else if (level === "warn") {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
}

export const logger = {
  info: (event: string, meta?: Record<string, unknown>) => write("info", event, meta),
  warn: (event: string, meta?: Record<string, unknown>) => write("warn", event, meta),
  error: (event: string, meta?: Record<string, unknown>) => write("error", event, meta),
};

// Normalizes any thrown value into a safe, loggable message — never
// includes a raw stack trace or the original error object in what gets
// returned to a caller that might surface it to the client.
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
