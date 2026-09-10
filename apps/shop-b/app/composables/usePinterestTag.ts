// Thin wrapper around the Pinterest Tag (`window.pintrk`). Safe to call on the
// server or before the tag has loaded — it no-ops unless `pintrk` is present.
export function usePinterestTag() {
  function track(event: string, data?: Record<string, unknown>) {
    if (import.meta.client && window.pintrk) {
      window.pintrk('track', event, data)
    }
  }

  return { track }
}
