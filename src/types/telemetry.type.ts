// Backwards-compatible aliases for legacy telemetry types.
// Prefer importing `TelemetryApp` / `TelemetryPointApp` from
// `./telemetry-app.type` instead.

import type { TelemetryPointApp, TelemetryApp } from './telemetry-app.type';

export type TelemetryPoint = TelemetryPointApp;
export type Telemetry = TelemetryApp;
