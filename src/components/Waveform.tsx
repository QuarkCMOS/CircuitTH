import { useRef, useMemo, useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { SimulationResult } from '../lib/circuitEngine';

const COLORS = [
  '#60a5fa',
  '#4ade80',
  '#fb923c',
  '#f472b6',
  '#a78bfa',
  '#34d399',
  '#fbbf24',
  '#f87171',
];

interface Props {
  result: SimulationResult | null;
  onClose: () => void;
}

export default function Waveform({ result, onClose }: Props) {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const plotRef = useRef<HTMLDivElement>(null);

  const nodes = result?.data?.[0]?.values ?? [];
  const voltageNodes = nodes.filter(v => v.type === 'voltage').map(v => v.name);

  useEffect(() => {
    if (voltageNodes.length > 0) {
      setSelectedNodes(voltageNodes.slice(0, 3));
    }
  }, [result]);

  const traces = useMemo(() => {
    if (!result?.success) return [];
    const analysisType = result.analysis_type;
    return selectedNodes.map((nodeName, index) => {
      const x = result.data.map(pt =>
        analysisType === 'tran' ? pt.sweep_value * 1000 : pt.sweep_value
      );
      const y = result.data.map(pt => {
        const value = pt.values.find(v => v.name === nodeName);
        if (!value) return null;
        if (analysisType === 'ac') {
          return 20 * Math.log10(
            Math.sqrt(value.real * value.real + value.imag * value.imag) || 1e-30
          );
        }
        return value.real;
      });
      return {
        x, y,
        type: 'scatter',
        mode: 'lines',
        name: analysisType === 'ac' ? `|${nodeName}| dB` : `V(${nodeName})`,
        line: { color: COLORS[index % COLORS.length], width: 2 },
      };
    });
  }, [result, selectedNodes]);

  const xTitle =
    result?.analysis_type === 'tran' ? 'Time (ms)' :
    result?.analysis_type === 'ac'   ? 'Frequency (Hz)' : 'Sweep';

  const yTitle =
    result?.analysis_type === 'ac' ? 'Magnitude (dB)' : 'Voltage (V)';

  useEffect(() => {
    if (!plotRef.current || !result?.success || traces.length === 0) return;
    Plotly.react(
      plotRef.current,
      traces as any,
      {
        autosize: true,
        paper_bgcolor: '#0d0f18',
        plot_bgcolor: '#0d0f18',
        font: { color: '#d1d5db' },
        margin: { l: 60, r: 20, t: 20, b: 50 },
        legend: { orientation: 'h', bgcolor: 'rgba(0,0,0,0)' },
        xaxis: { title: { text: xTitle }, gridcolor: '#1f2937', zerolinecolor: '#374151' },
        yaxis: { title: { text: yTitle }, gridcolor: '#1f2937', zerolinecolor: '#374151' },
      },
      { responsive: true, displaylogo: false, scrollZoom: true }
    );
  }, [traces, xTitle, yTitle]);

  // Khi panel bị resize, báo Plotly vẽ lại
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      Plotly.Plots.resize(el);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleNode = (name: string) => {
    setSelectedNodes(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <div style={{
      width: '45%',
      minWidth: 320,
      background: '#0d0f18',
      borderRight: '2px solid #2563eb',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', // ngăn tràn ra ngoài
    }}>
      {/* Header */}
      <div style={{
        height: 38,
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#1a1d27',
        borderBottom: '1px solid #2a2d3a',
        flexShrink: 0,
      }}>
        <span style={{ color: '#90caf9', fontWeight: 600, fontSize: 13 }}>
          Waveform
          {result?.analysis_type && ` (.${result.analysis_type.toUpperCase()})`}
        </span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Signal selector */}
      {nodes.length > 0 && (
        <div style={{
          padding: 8,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          borderBottom: '1px solid #1e2235',
          flexShrink: 0,
        }}>
          {voltageNodes.map((node, i) => {
            const active = selectedNodes.includes(node);
            return (
              <button
                key={node}
                onClick={() => toggleNode(node)}
                style={{
                  padding: '3px 8px',
                  fontSize: 11,
                  borderRadius: 4,
                  border: `1px solid ${active ? COLORS[i % COLORS.length] : '#333'}`,
                  background: active ? COLORS[i % COLORS.length] + '22' : 'transparent',
                  color: active ? COLORS[i % COLORS.length] : '#777',
                  cursor: 'pointer',
                }}
              >
                V({node})
              </button>
            );
          })}
        </div>
      )}

      {/* Plot — bọc thêm 1 lớp div để giới hạn kích thước tuyệt đối */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        {result?.success ? (
          <div
            ref={plotRef}
            style={{
              position: 'absolute',
              inset: 0, // top/right/bottom/left = 0, đảm bảo không tràn
            }}
          />
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#666',
          }}>
            Run simulation to view waveform
          </div>
        )}
      </div>
    </div>
  );
}