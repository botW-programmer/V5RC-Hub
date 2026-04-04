import { useEffect, useRef, useState } from 'react';

export default function RoverSandbox() {
  const canvasRef = useRef(null);
  const scale = 3; 

  // --- STATE ---
  const [position, setPosition] = useState({ x: 72, y: 72, heading: 0 });
  const [waypoints, setWaypoints] = useState([]);
  const [interactionMode, setInteractionMode] = useState('draw'); 
  const [draggingTask, setDraggingTask] = useState(null); 
  const [codeLang, setCodeLang] = useState('cpp'); 
  const [actionLog, setActionLog] = useState(['Robot Initialized at (72.0", 72.0")']);

  const addLog = (message) => {
    setActionLog((prevLogs) => [message, ...prevLogs]);
  };

  // --- MOUSE LOGIC ---
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mX = (e.clientX - rect.left) / scale;
    const mY = (canvasRef.current.height - (e.clientY - rect.top)) / scale;

    if (interactionMode === 'place') {
      const rad = position.heading * Math.PI / 180;
      const handleX = position.x + Math.sin(rad) * 25; 
      const handleY = position.y + Math.cos(rad) * 25;

      const distToHandle = Math.sqrt((mX - handleX)**2 + (mY - handleY)**2);
      
      if (distToHandle < 8) {
        setDraggingTask('rotate');
      } else {
        setDraggingTask('move');
        setPosition(p => ({ ...p, x: mX, y: mY }));
        setWaypoints([]); 
      }
    } else {
      setWaypoints(prev => [...prev, { x: mX, y: mY }]);
      addLog(`Waypoint added at X: ${mX.toFixed(1)}", Y: ${mY.toFixed(1)}"`);
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingTask || interactionMode !== 'place') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mX = (e.clientX - rect.left) / scale;
    const mY = (canvasRef.current.height - (e.clientY - rect.top)) / scale;

    if (draggingTask === 'move') {
      setPosition(p => ({ ...p, x: mX, y: mY }));
    } else if (draggingTask === 'rotate') {
      const dx = mX - position.x;
      const dy = mY - position.y;
      let angle = Math.atan2(dx, dy) * (180 / Math.PI);
      setPosition(p => ({ ...p, heading: angle }));
    }
  };

  const handleMouseUp = () => {
    if (draggingTask === 'move') {
      addLog(`Start moved to X: ${position.x.toFixed(1)}", Y: ${position.y.toFixed(1)}"`);
      setInteractionMode('draw');
    } else if (draggingTask === 'rotate') {
      addLog(`Angle set to ${position.heading.toFixed(1)}°`);
      setInteractionMode('draw');
    }
    setDraggingTask(null);
  };

  const clearWaypoints = () => {
    setWaypoints([]);
    addLog('Cleared all waypoints.');
  };

  // --- DRAWING ---
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 432, 432);
    
    // Draw Grid
    ctx.strokeStyle = '#333';
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath(); ctx.moveTo(i*24*scale, 0); ctx.lineTo(i*24*scale, 432); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i*24*scale); ctx.lineTo(432, i*24*scale); ctx.stroke();
    }

    // Draw Path
    if (waypoints.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#ffeb3b';
      ctx.lineWidth = 2;
      ctx.moveTo(position.x * scale, 432 - (position.y * scale));
      waypoints.forEach(wp => ctx.lineTo(wp.x * scale, 432 - (wp.y * scale)));
      ctx.stroke();

      ctx.fillStyle = '#ff1744';
      waypoints.forEach((wp) => {
        ctx.beginPath();
        ctx.arc(wp.x * scale, 432 - (wp.y * scale), 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw Robot & Handle
    ctx.save();
    ctx.translate(position.x * scale, 432 - (position.y * scale));
    ctx.rotate(position.heading * Math.PI / 180);
    
    const rSize = 18 * scale;
    ctx.fillStyle = interactionMode === 'place' ? '#ffeb3b' : '#128daf';
    ctx.fillRect(-rSize/2, -rSize/2, rSize, rSize);
    
    ctx.strokeStyle = 'white';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -25*scale); ctx.stroke();
    
    ctx.fillStyle = '#00baee';
    ctx.beginPath(); ctx.arc(0, -25 * scale, 6, 0, Math.PI*2); ctx.fill();
    
    ctx.restore();
  }, [position, waypoints, interactionMode, draggingTask]);

  return (
    <div style={{ padding: '40px 20px 120px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Autonomous Playbook</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: '500', lineHeight: '1.5', fontSize: '15px' }}>
          Visually plan your robot's path and automatically generate coordinate arrays in both C++ and Python for your autonomous routines! 
          <br/><br/>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
            (Note: The background will be updated with the official field map once the 2026-2027 V5RC game is announced at Worlds!)
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', width: '100%', maxWidth: '1200px' }}>
        
        {/* Left Side: Canvas & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', backgroundColor: '#1e1e2f', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
            <button 
              onClick={() => setInteractionMode('place')} 
              style={{ ...toggleStyle, backgroundColor: interactionMode === 'place' ? '#ffeb3b' : '#333', color: interactionMode === 'place' ? '#000' : '#fff' }}
            >
               Set Start & Angle
            </button>
            <button 
              onClick={() => setInteractionMode('draw')} 
              style={{ ...toggleStyle, backgroundColor: interactionMode === 'draw' ? '#00baee' : '#333', color: interactionMode === 'draw' ? '#000' : '#fff' }}
            >
               Draw Route
            </button>
            <button onClick={clearWaypoints} style={{...toggleStyle, backgroundColor: '#00baee', color: '#000000', marginLeft: '10px'}}>
              Clear Path
            </button>
          </div>

          <canvas 
            ref={canvasRef} width={432} height={432} 
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            style={{ backgroundColor: '#1a1a2e', border: '4px solid #444', borderRadius: '8px', cursor: interactionMode === 'place' ? 'crosshair' : 'crosshair' }}
          />

          <div style={{ marginTop: '15px', color: '#888', fontFamily: 'monospace', fontSize: '15px' }}>
            X: <span style={{color: '#478da8', fontWeight: 'bold'}}>{position.x.toFixed(1)}"</span> | 
            Y: <span style={{color: '#478da8', fontWeight: 'bold'}}>{position.y.toFixed(1)}"</span> | 
            Heading: <span style={{color: '#00baee', fontWeight: 'bold'}}>{position.heading.toFixed(1)}°</span>
          </div>
        </div>

        {/* Right Side: Generated Code & Logs */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', flex: 1, minWidth: '500px' }}>
          
          {/* Code Generator Box */}
          <div style={{ backgroundColor: '#1e1e2f', padding: '15px', borderRadius: '6px', border: '1px solid #333', flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#00baee' }}>Generated Path</h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => setCodeLang('cpp')} style={{ ...tabStyle, backgroundColor: codeLang === 'cpp' ? '#00baee' : '#333', color: codeLang === 'cpp' ? '#000' : '#fff' }}>C++</button>
                <button onClick={() => setCodeLang('python')} style={{ ...tabStyle, backgroundColor: codeLang === 'python' ? '#ffeb3b' : '#333', color: codeLang === 'python' ? '#000' : '#fff' }}>Python</button>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#111', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px', color: '#00e676', overflowY: 'auto', height: '350px' }}>
              
              <div style={{ color: '#888', marginBottom: '8px' }}>
                // Starting Position: ({position.x.toFixed(1)}, {position.y.toFixed(1)})<br/>
                // Starting Heading: {position.heading.toFixed(1)}°
              </div>

              {waypoints.length === 0 && <span style={{ color: '#555' }}>// Click field to add waypoints</span>}
              
              {codeLang === 'cpp' && waypoints.length > 0 && (
                <>
                  <div>std::vector&lt;Point&gt; autoPath = {"{"}</div>
                  {waypoints.map((wp, index) => (
                    <div key={index} style={{ paddingLeft: '20px' }}>
                      {"{"} {wp.x.toFixed(1)}, {wp.y.toFixed(1)} {"}," }
                    </div>
                  ))}
                  <div>{"};"}</div>
                </>
              )}

              {codeLang === 'python' && waypoints.length > 0 && (
                <>
                  <div>auto_path = [</div>
                  {waypoints.map((wp, index) => (
                    <div key={index} style={{ paddingLeft: '20px' }}>
                      ({wp.x.toFixed(1)}, {wp.y.toFixed(1)}),
                    </div>
                  ))}
                  <div>]</div>
                </>
              )}
            </div>
          </div>

          {/* Action Log Box */}
          <div style={{ backgroundColor: '#1e1e2f', padding: '15px', borderRadius: '6px', border: '1px solid #333', flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', height: '26px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#ffb74d' }}>Action Log</h3>
            </div>

            <div style={{ backgroundColor: '#111', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', color: '#ffb74d', overflowY: 'auto', height: '350px' }}>
              {actionLog.map((log, index) => (
                <div key={index} style={{ marginBottom: '6px', lineHeight: '1.4' }}>
                  <span style={{ color: '#555' }}>[{actionLog.length - index}]</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const toggleStyle = {
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '4px',
  transition: 'background-color 0.2s'
};

const tabStyle = {
  padding: '4px 8px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '3px',
};