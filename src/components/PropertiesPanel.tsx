import type { CircuitComponent, VSourceParams, VSourceType } from '../types';

const GRID = 20;

function updatePins(x: number, y: number, rotation: number) {
  const d = GRID * 2;
  switch (rotation) {
    case 90:  return [{ x, y: y - d }, { x, y: y + d }];
    case 180: return [{ x: x + d, y }, { x: x - d, y }];
    case 270: return [{ x, y: y + d }, { x, y: y - d }];
    default:  return [{ x: x - d, y }, { x: x + d, y }];
  }
}

// ── default vsource params per type ───────────────────────────────────────────
function defaultVSource(type: VSourceType): VSourceParams {
  switch (type) {
    case 'DC':    return { type: 'DC', dc: '5' };
    case 'AC':    return { type: 'AC', dc: '0', ac_mag: '1', ac_phase: '0' };
    case 'PULSE': return { type: 'PULSE', v1: '0', v2: '5', td: '0', tr: '1n', tf: '1n', pw: '500n', per: '1u' };
    case 'SIN':   return { type: 'SIN', vo: '0', va: '5', freq: '1k', td: '0', theta: '0' , phase: '0'};
  }
}

// ── reusable field row ─────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6, gap: 6 }}>
      <label style={{ width: 70, flexShrink: 0, fontSize: 11, color: '#555' }}>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.stopPropagation()}
        style={{ flex: 1, fontSize: 12, padding: '3px 6px', borderRadius: 4, border: '1px solid #ccc' }}
      />
    </div>
  );
}

// ── VSource sub-form ───────────────────────────────────────────────────────────
function VSourceForm({
  params,
  onChange,
}: {
  params: VSourceParams;
  onChange: (p: VSourceParams) => void;
}) {
  function set(patch: Partial<VSourceParams>) {
    onChange({ ...params, ...patch } as VSourceParams);
  }

  const typeSelector = (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 6 }}>
      <label style={{ width: 70, flexShrink: 0, fontSize: 11, color: '#555' }}>Waveform</label>
      <select
        value={params.type}
        onChange={e => onChange(defaultVSource(e.target.value as VSourceType))}
        style={{ flex: 1, fontSize: 12, padding: '3px 6px', borderRadius: 4, border: '1px solid #ccc' }}
      >
        <option value="DC">DC</option>
        <option value="AC">AC</option>
        <option value="PULSE">PULSE</option>
        <option value="SIN">SIN</option>
      </select>
    </div>
  );

  if (params.type === 'DC') return (
    <>
      {typeSelector}
      <Field label="DC (V)" value={params.dc} onChange={v => set({ dc: v })} placeholder="5" />
    </>
  );

  if (params.type === 'AC') return (
    <>
      {typeSelector}
      <Field label="DC offset" value={params.dc}       onChange={v => set({ dc: v })}       placeholder="0" />
      <Field label="AC mag"    value={params.ac_mag}   onChange={v => set({ ac_mag: v })}   placeholder="1" />
      <Field label="Phase (°)" value={params.ac_phase} onChange={v => set({ ac_phase: v })} placeholder="0" />
    </>
  );

  if (params.type === 'PULSE') return (
    <>
      {typeSelector}
      <Field label="V1 (V)"   value={params.v1}  onChange={v => set({ v1: v })}  placeholder="0" />
      <Field label="V2 (V)"   value={params.v2}  onChange={v => set({ v2: v })}  placeholder="5" />
      <Field label="Delay"    value={params.td}  onChange={v => set({ td: v })}  placeholder="0" />
      <Field label="Rise"     value={params.tr}  onChange={v => set({ tr: v })}  placeholder="1n" />
      <Field label="Fall"     value={params.tf}  onChange={v => set({ tf: v })}  placeholder="1n" />
      <Field label="PW"       value={params.pw}  onChange={v => set({ pw: v })}  placeholder="500n" />
      <Field label="Period"   value={params.per} onChange={v => set({ per: v })} placeholder="1u" />
    </>
  );

  if (params.type === 'SIN') return (
    <>
      {typeSelector}
      <Field label="Offset (V)" value={params.vo}    onChange={v => set({ vo: v })}    placeholder="0" />
      <Field label="Ampl (V)"   value={params.va}    onChange={v => set({ va: v })}    placeholder="5" />
      <Field label="Freq (Hz)"  value={params.freq}  onChange={v => set({ freq: v })}  placeholder="1k" />
      <Field label="Delay"      value={params.td}    onChange={v => set({ td: v })}    placeholder="0" />
      <Field label="Damping"    value={params.theta} onChange={v => set({ theta: v })} placeholder="0" />
      <Field label="Phase"    value={params.phase} onChange={v => set({ phase: v })} placeholder="0" />
    </>
  );

  return null;
}

// ── Main panel ────────────────────────────────────────────────────────────────
interface Props {
  selected: CircuitComponent | null;
  onUpdate: (updated: CircuitComponent) => void;
  onDelete: () => void;
}

export default function PropertiesPanel({ selected, onUpdate, onDelete }: Props) {
  if (!selected) {
    return (
      <div className="properties">
        <h3>Properties</h3>
        <p>No component selected</p>
      </div>
    );
  }

  function rotate() {
    const newRot = (((selected!.rotation || 0) + 90) % 360) as 0 | 90 | 180 | 270;
    onUpdate({ ...selected!, rotation: newRot, pins: updatePins(selected!.x, selected!.y, newRot) });
  }

  function flipX() {
    const newRot = (((selected!.rotation || 0) + 180) % 360) as 0 | 90 | 180 | 270;
    onUpdate({ ...selected!, flipX: !selected!.flipX, rotation: newRot, pins: updatePins(selected!.x, selected!.y, newRot) });
  }

  function flipY() {
    const newRot = (((selected!.rotation || 0) + 180) % 360) as 0 | 90 | 180 | 270;
    onUpdate({ ...selected!, flipY: !selected!.flipY, rotation: newRot, pins: updatePins(selected!.x, selected!.y, newRot) });
  }

  // Ensure V always has vsource params
  const vsource = selected.type === 'V'
    ? (selected.vsource ?? defaultVSource('DC'))
    : undefined;

  return (
    <div className="properties">
      <h3>Properties — {selected.type === 'R' ? 'Resistor' : selected.type === 'V' ? 'Voltage Source' : selected.type}</h3>

      <Field
        label="Name"
        value={selected.id}
        onChange={v => onUpdate({ ...selected, id: v })}
      />

      {/* Resistor: just a value field */}
      {selected.type === 'R' && (
        <Field
          label="Value (Ω)"
          value={selected.value}
          onChange={v => onUpdate({ ...selected, value: v })}
          placeholder="1k"
        />
      )}

      {/* Voltage source: waveform sub-form */}
      {selected.type === 'V' && vsource && (
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 4 }}>
          <VSourceForm
            params={vsource}
            onChange={p => onUpdate({ ...selected, vsource: p })}
          />
        </div>
      )}

      <div className="button-group" style={{ marginTop: 12 }}>
        <button onClick={rotate}>↻ Rotate</button>
        <button onClick={flipX}>↔ Flip X</button>
        <button onClick={flipY}>↕ Flip Y</button>
      </div>

      <button className="deleteBtn" onClick={onDelete} style={{ marginTop: 8 }}>
        Delete
      </button>
    </div>
  );
}
