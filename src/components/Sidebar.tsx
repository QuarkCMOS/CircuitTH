interface Props {
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
}

export default function Sidebar({ selectedTool, setSelectedTool }: Props) {
  function toggle(tool: string) {
    setSelectedTool(selectedTool === tool ? null : tool);
  }

  return (
    <div className="sidebar">
      <h2>Components</h2>
      <button className={selectedTool === 'R' ? 'activeTool' : ''} onClick={() => toggle('R')}>
        Resistor (R)
      </button>
      <button className={selectedTool === 'V' ? 'activeTool' : ''} onClick={() => toggle('V')}>
        Voltage Source (V)
      </button>

      <hr style={{ borderColor: '#444', margin: '12px 0' }} />
      <h2>Wiring</h2>
      <button className={selectedTool === 'wire' ? 'activeTool' : ''} onClick={() => toggle('wire')}>
        Wire (W)
      </button>

      <hr style={{ borderColor: '#444', margin: '12px 0' }} />
      <div style={{ fontSize: '11px', color: '#aaa', lineHeight: '1.8' }}>
        <b style={{ color: '#ccc' }}>Place:</b> chọn tool → click<br />
        <b style={{ color: '#ccc' }}>Shift+click:</b> đặt nhiều<br />
        <b style={{ color: '#ccc' }}>R:</b> xoay khi đặt<br />
        <b style={{ color: '#ccc' }}>Esc:</b> hủy tool<br />
        <hr style={{ borderColor: '#555', margin: '6px 0' }} />
        <b style={{ color: '#ccc' }}>Wire:</b> click bắt đầu → click kết thúc<br />
        <b style={{ color: '#ccc' }}>Click trống:</b> waypoint<br />
        <hr style={{ borderColor: '#555', margin: '6px 0' }} />
        <b style={{ color: '#ccc' }}>Del:</b> xóa selection<br />
        <b style={{ color: '#ccc' }}>Drag:</b> di chuyển<br />
        <hr style={{ borderColor: '#555', margin: '6px 0' }} />
        <b style={{ color: '#22cc88' }}>Scroll:</b> zoom tại con trỏ<br />
        <b style={{ color: '#22cc88' }}>Kéo nền:</b> pan (di chuyển vùng nhìn)<br />
        <b style={{ color: '#22cc88' }}>+/−:</b> zoom vào giữa<br />
        <b style={{ color: '#22cc88' }}>Ctrl+0:</b> reset view
      </div>
    </div>
  );
}
