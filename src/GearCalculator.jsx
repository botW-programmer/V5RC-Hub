import { useState } from 'react';
import { Settings, Zap, Gauge, BatteryCharging } from 'lucide-react';

export default function GearCalculator() {
  const [motorRPM, setMotorRPM] = useState(200);
  const [drivingGear, setDrivingGear] = useState(36);
  const [drivenGear, setDrivenGear] = useState(60);
  const [wheelSize, setWheelSize] = useState(3.25);
  const [motorCount, setMotorCount] = useState(4);

  // --- KINEMATICS (Mechanical Math) ---
  const outputRPM = motorRPM * (drivingGear / drivenGear);
  const circumference = Math.PI * wheelSize;
  const speedIPS = (outputRPM / 60) * circumference;

  const simplifyRatio = (drive, driven) => {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(drive, driven);
    return `${drive / divisor} : ${driven / divisor}`;
  };

  // --- POWER DYNAMICS (Electrical Math) ---
  const totalWatts = motorCount * 11;
  const powerCapacity = (motorCount / 8) * 100; // 8 motors (88W) is the max standard V5 limit

  const getPowerLabel = (count) => {
    if (count <= 2) return "Low Torque (Lightweight only)";
    if (count === 4) return "Standard (Balanced payload)";
    if (count === 6) return "High Torque (Heavy push/defense)";
    if (count >= 8) return "Maximum Output (Powerhouse)";
    return "Unknown";
  };

  const getMotorColor = (rpm) => {
    if (rpm === 100) return '#ff5f56'; // Red
    if (rpm === 200) return '#27c93f'; // Green
    if (rpm === 600) return '#38bdf8'; // Blue
    return 'var(--text-muted)';
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Settings size={40} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Gear Calculator</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.5' }}>
            Calculate your drivetrain's theoretical limits. The <strong>Kinematics</strong> profile shows your top speed in the air, while the <strong>Power Dynamics</strong> profile shows if you have enough motor torque to actually reach that speed on the field!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        
        {/* LEFT COLUMN: THE INPUTS */}
        <div className="os-window" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
          <div className="os-titlebar">
            <span className="os-dot dot-red"></span>
            <span className="os-dot dot-yellow"></span>
            <span className="os-dot dot-green"></span>
            hardware_config.cfg
          </div>
          
          <div style={{ padding: '25px' }}>
            
            {/* Electrical Section */}
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--window-border)', marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--accent)', margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Electrical Profile</h4>
              <div>
                <label style={labelStyle}>Number of Motors (11W each)</label>
                <select className="os-input" value={motorCount} onChange={(e) => setMotorCount(Number(e.target.value))}>
                  <option value={2}>2 Motors</option>
                  <option value={4}>4 Motors</option>
                  <option value={6}>6 Motors</option>
                  <option value={8}>8 Motors</option>
                </select>
              </div>
            </div>

            {/* Mechanical Section */}
            <div>
              <h4 style={{ color: '#27c93f', margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mechanical Profile</h4>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Motor Cartridge (Internal RPM)</label>
                <select className="os-input" value={motorRPM} onChange={(e) => setMotorRPM(Number(e.target.value))} style={{ borderLeft: `4px solid ${getMotorColor(motorRPM)}` }}>
                  <option value={100}>100 RPM (Red - High Torque)</option>
                  <option value={200}>200 RPM (Green - Standard)</option>
                  <option value={600}>600 RPM (Blue - High Speed)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Driving Gear</label>
                  <select className="os-input" value={drivingGear} onChange={(e) => setDrivingGear(Number(e.target.value))}>
                    <option value={12}>12T</option>
                    <option value={24}>24T</option>
                    <option value={36}>36T</option>
                    <option value={48}>48T</option>
                    <option value={60}>60T</option>
                    <option value={72}>72T</option>
                    <option value={84}>84T</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Driven Gear</label>
                  <select className="os-input" value={drivenGear} onChange={(e) => setDrivenGear(Number(e.target.value))}>
                    <option value={12}>12T</option>
                    <option value={24}>24T</option>
                    <option value={36}>36T</option>
                    <option value={48}>48T</option>
                    <option value={60}>60T</option>
                    <option value={72}>72T</option>
                    <option value={84}>84T</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Wheel Diameter</label>
                <select className="os-input" value={wheelSize} onChange={(e) => setWheelSize(Number(e.target.value))}>
                  <option value={2.75}>2.75" (Small)</option>
                  <option value={3.25}>3.25" (Standard)</option>
                  <option value={4.0}>4.0" (Large)</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: THE RESULTS */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CARD 1: KINEMATICS (Speed & RPM) */}
          <div className="os-window" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="os-titlebar" style={{ backgroundColor: '#27c93f', color: '#000', borderBottom: 'none' }}>
              <Gauge size={14} style={{ marginRight: '6px' }}/> kinematics.sys
            </div>
            
            <div style={{ padding: '25px', textAlign: 'center', borderBottom: '1px solid var(--window-border)' }}>
              <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', marginBottom: '8px', fontWeight: '700' }}>Theoretical Top Speed</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                {speedIPS.toFixed(1)} <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>in/sec</span>
              </div>
            </div>

            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, padding: '20px', textAlign: 'center', borderRight: '1px solid var(--window-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontWeight: '700' }}>Wheel RPM</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>{outputRPM.toFixed(0)}</div>
              </div>
              <div style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontWeight: '700' }}>Ratio (In:Out)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>{simplifyRatio(drivingGear, drivenGear)}</div>
              </div>
            </div>
          </div>

          {/* CARD 2: POWER DYNAMICS (Wattage & Torque) */}
          <div className="os-window" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="os-titlebar" style={{ backgroundColor: '#ff5f56', color: '#fff', borderBottom: 'none' }}>
              <Zap size={14} style={{ marginRight: '6px' }}/> power_dynamics.sys
            </div>
            
            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', marginBottom: '4px', fontWeight: '700' }}>Total Output Power</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalWatts} <span style={{ fontSize: '16px', color: '#ff5f56' }}>Watts</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <BatteryCharging size={24} color="#ff5f56" />
                </div>
              </div>

              {/* Dynamic Torque Bar */}
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                <span>Pushing Capacity</span>
                <span style={{ color: motorCount >= 6 ? '#ff5f56' : 'var(--text-muted)' }}>{getPowerLabel(motorCount)}</span>
              </div>
              <div style={{ width: '100%', backgroundColor: 'var(--window-bg)', height: '12px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--window-border)' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${powerCapacity}%`, 
                  backgroundColor: '#ff5f56',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' };