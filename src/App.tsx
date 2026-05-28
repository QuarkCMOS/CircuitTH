
import { useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

import type {
  CircuitComponent,
  Wire,
} from './types';

import { generateNetlist } from './utils/netlist';

export default function App() {
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedComponent,setSelectedComponent] = useState<CircuitComponent | null>(null);
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  function updateComponent(updated: CircuitComponent) {
    setComponents((prev) =>
      prev.map((c) =>
        c.uuid === updated.uuid
          ? updated
          : c
      )
    );
    setSelectedComponent(updated);
  }

  function deleteSelectedComponent() {
    if (!selectedComponent) return;
    setComponents((prev) =>
      prev.filter(
        (c) =>
          c.uuid !== selectedComponent.uuid
      )
    );
    setSelectedComponent(null);
  }

  function deleteSelectedWire() {
    if (!selectedWire) return;
    setWires((prev) =>
      prev.filter(
        (w) =>
          w.id !== selectedWire
      )
    );
    setSelectedWire(null);
  }

  return (
    <div className="app">
      <Sidebar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex' }}>
        <Canvas
          components={components}
          wires={wires}
          selectedComponent={selectedComponent}
          selectedWire={selectedWire}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          setComponents={setComponents}
          setWires={setWires}
          setSelectedComponent={setSelectedComponent}
          setSelectedWire={setSelectedWire}
        />
      </div>

      <div className="rightPanel">
        <PropertiesPanel
          selected={selectedComponent}
          onUpdate={updateComponent}
          onDelete={deleteSelectedComponent}
        />
        <div className="netlistPanel">
          <h3>Netlist</h3>
          <textarea
            value={generateNetlist(components,wires)}
            readOnly
          />
          <button
            onClick={deleteSelectedWire}
          >
            Delete Wire
          </button>
        </div>
      </div>
    </div>
  );
}

