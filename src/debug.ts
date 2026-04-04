import type { DebugEvent, DebugLogger } from "./types";

export function emitDebug(
  logger: DebugLogger | undefined,
  event: DebugEvent,
): void {
  if (!logger) {
    return;
  }

  try {
    logger(event);
  } catch {
    // Consumer logging must never affect package behavior.
  }
}
