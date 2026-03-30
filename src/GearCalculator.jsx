import { useState } from 'react';
import { Settings, Zap, RotateCw } from 'lucide-react';

export default function GearCalculator() {
  const [motorRPM, setMotorRPM] = useState(200);
  const [drivingGear, setDrivingGear] = useState(36);
  const [drivenGear, setDrivenGear] = useState(60);
  const [wheelSize, setWheelSize] = useState(3.25);
  const [motorCount, setMotorCount] = useState(4);

  const outputRPM = motorRPM * (drivingGear / drivenGear);
  const circumference = Math.PI * wheelSize;
  const speedIPS = (outputRPM / 60) * circumference;

  const simplifyRatio = (drive, driven) => {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(drive, driven);
    return `${drive / divisor} : ${driven / divisor}`;
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
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>calculating gear ratio is really annoying... but have no fear, for i have created the CALCULATOR! it's actually a lot cooler than it sounds; simply input the information of your drivetrain, and voila, your gear ratio, theoretical top speed, and wheel output RPM are all calculated for you! feel free to use this in your engineering notebooks!</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        
        {/* LEFT COLUMN: THE INPUTS (Now an OS Window!) */}
        <div className="os-window" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
          
          <div className="os-titlebar">
            <span className="os-dot dot-red"></span>
            <span className="os-dot dot-yellow"></span>
            <span className="os-dot dot-green"></span>
            hardware_config.cfg
          </div>
          
          <div style={{ padding: '25px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Number of Motors</label>
              <select className="os-input" value={motorCount} onChange={(e) => setMotorCount(Number(e.target.value))}>
                <option value={2}>2 Motors (Lightweight)</option>
                <option value={4}>4 Motors (Standard)</option>
                <option value={6}>6 Motors (Heavy Push)</option>
                <option value={8}>8 Motors (Maximum Power)</option>
              </select>
            </div>

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

        {/* RIGHT COLUMN: THE RESULTS */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="os-window" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="os-titlebar" style={{ backgroundColor: 'var(--accent)', color: '#000' }}>
              <Zap size={14} style={{ marginRight: '4px' }}/> results_output.exe
            </div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', marginBottom: '10px', fontWeight: '700' }}>Theoretical Top Speed</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                {speedIPS.toFixed(1)} <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>in/sec</span>
              </div>
              <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
                Requires {motorCount * 11}W of total motor power
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="os-window" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px', fontWeight: '700' }}>Wheel Output RPM</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                {outputRPM.toFixed(0)}
              </div>
            </div>
            
            <div className="os-window" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px', fontWeight: '700' }}>Ratio (Drive:Driven)</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                {simplifyRatio(drivingGear, drivenGear)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' };