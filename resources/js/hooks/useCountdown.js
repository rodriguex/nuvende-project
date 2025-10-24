import { useEffect, useState, useCallback } from "react";

/**
 * Custom countdown timer hook.
 * @param {number} initialSeconds - starting number of seconds
 */
export function useCountdown(initialSeconds = 3600) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [running, seconds]);

  const start = useCallback(() => setRunning(true), []);
  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setRunning(false);
  }, [initialSeconds]);

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return { seconds, minutes, remaining, running, start, reset };
}
