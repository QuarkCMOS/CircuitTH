export type ComponentType =
  | 'R'
  | 'V'
  | 'GND';

export interface Point {
  x: number;
  y: number;
}

export interface Pin extends Point {}

export interface Wire {
  id: string;
  points: Point[];
}

// ── Voltage source waveform params ─────────────────────────────────────────

export type VSourceType = 'DC' | 'AC' | 'PULSE' | 'SIN';

export interface VSourceDC {
  type: 'DC';
  dc: string;           // e.g. "5"
}

export interface VSourceAC {
  type: 'AC';
  dc: string;           // DC offset
  ac_mag: string;       // AC magnitude
  ac_phase: string;     // AC phase (degrees)
}

export interface VSourcePulse {
  type: 'PULSE';
  v1: string;           // initial value
  v2: string;           // pulsed value
  td: string;           // delay time
  tr: string;           // rise time
  tf: string;           // fall time
  pw: string;           // pulse width
  per: string;          // period
}

export interface VSourceSin {
  type: 'SIN';
  vo: string;           // DC offset
  va: string;           // amplitude
  freq: string;         // frequency (Hz)
  td: string;           // delay
  theta: string;        // damping factor
  phase: string
}

export type VSourceParams = VSourceDC | VSourceAC | VSourcePulse | VSourceSin;

// ── Component ──────────────────────────────────────────────────────────────

export interface CircuitComponent {
  uuid: string;
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
  /** For R: resistance value string. For V: unused (see vsource). */
  value: string;
  /** Voltage source waveform config (only present when type === 'V') */
  vsource?: VSourceParams;
  pins: Pin[];
}
