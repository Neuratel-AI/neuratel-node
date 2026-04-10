export interface PlatformEvent {
  type: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}
