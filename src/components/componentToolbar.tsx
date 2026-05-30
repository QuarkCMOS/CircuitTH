interface Props {
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
}

export default function Sidebar({ selectedTool, setSelectedTool }: Props) {
  function toggle(tool: string) {
    setSelectedTool(selectedTool === tool ? null : tool);
  }

  const componentIcons = [
    { tool: 'R', icon: 'R', title: 'Resistor' },
    { tool: 'V', icon: 'V', title: 'Voltage Source' },
    { tool: 'GND', icon: 'GND', title: 'Ground' },
  ];

  const wiringIcons = [
    { tool: 'wire', icon: 'W', title: 'Wire' },
  ];

  return (
    <div className="componentToolbar">
      <div className="toolbarGroup">
        <div className="toolbarButtons">
          {componentIcons.map(({ tool, icon, title }) => (
            <button
              key={tool}
              className={selectedTool === tool ? 'activeTool' : ''}
              onClick={() => toggle(tool)}
              title={title}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 4px',
                borderRadius: 6,
                border: '2px solid transparent',
                background: selectedTool === tool ? '#2563eb' : '#333',
                cursor: 'pointer',
                fontSize: 20,
                color: 'white',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (selectedTool !== tool) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#444';
                }
              }}
              onMouseLeave={e => {
                if (selectedTool !== tool) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#333';
                }
              }}
            >
              <span>{icon}</span>
              <span style={{ fontSize: 10, fontWeight: 500 }}></span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbarGroup">
        <div className="toolbarButtons">
          {wiringIcons.map(({ tool, icon, title }) => (
            <button
              key={tool}
              className={selectedTool === tool ? 'activeTool' : ''}
              onClick={() => toggle(tool)}
              title={title}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 4px',
                borderRadius: 6,
                border: '2px solid transparent',
                background: selectedTool === tool ? '#2563eb' : '#333',
                cursor: 'pointer',
                fontSize: 20,
                color: 'white',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (selectedTool !== tool) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#444';
                }
              }}
              onMouseLeave={e => {
                if (selectedTool !== tool) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#333';
                }
              }}
            >
              <span>{icon}</span>
              <span style={{ fontSize: 10, fontWeight: 500 }}></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
