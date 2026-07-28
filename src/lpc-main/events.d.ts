export {};

declare global {
  interface Window {
    dispatchEvent(event: CustomEvent): void;
  }
}
