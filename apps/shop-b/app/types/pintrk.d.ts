export {}

declare global {
  interface PinterestTag {
    (command: string, ...args: unknown[]): void
    queue: unknown[]
    version: string
  }

  interface Window {
    pintrk?: PinterestTag
  }
}
