import { useState, useEffect } from 'react';
import { PlaneTakeoff, RotateCcw, Check, ListChecks } from 'lucide-react';
import './index.css';

// The New Technical Data Structure
const rawChecklistData = {
  "Pre-Tournament": [
    "Verify V5 Brain and Controller firmware are up to date via VEXcode.",
    "Calibrate Inertial Sensor (IMU) and Vision Sensors.",
    "Check all drive and lift shafts for twisted axles or friction buildup.",
    "Ensure all motor cartridges (e.g., 600rpm/blue) match the code configuration.",
    "Download and verify all Autonomous routines (Skills, Left side, Right side) on the Brain.",
    "Backup code to an external flash drive or GitHub."
  ],
  "Packing for Tournament": [
    "Pack minimum 4 fully charged V5 Batteries and 2 chargers.",
    "Pack spare V5 Smart Cables (assorted lengths) and a crimping tool.",
    "Pack spare structural parts (c-channels, standoffs, zip-ties, rubber bands).",
    "Pack safety glasses for the drive team and pit crew.",
    "Pack the V5 Controller and a backup USB-C charging cable."
  ],
  "Pre-Inspection": [
    "Verify robot fits comfortably within the 18\" x 18\" x 18\" sizing tool.",
    "Ensure correct Alliance License Plates (Red/Blue) are securely mounted and visible.",
    "Check that pneumatics are completely empty before pressure testing with the inspector.",
    "File down any sharp edges or exposed metal.",
    "Have the VEXcode 'Device Info' screen ready for software inspection."
  ],
  "Pre-Match": [
    "Insert a fresh, 100% charged V5 Battery.",
    "Pressurize pneumatic system to exactly 100 PSI (check for leaks).",
    "Verify the V5 Radio is securely plugged into a smart port and flashing.",
    "Select the correct Autonomous routine on the brain for your starting position.",
    "Pre-load rings/game elements onto the robot per the current game manual.",
    "Turn on Controller and verify a solid connection to the Brain."
  ],
  "Post-Match": [
    "Turn off V5 Brain to preserve battery.",
    "Inspect robot for loose screws, shifted collars, or bent metal.",
    "Check motors for overheating (swap if necessary).",
    "Log match data/scouting notes while it's fresh in your mind.",
    "Place the used battery on the charger."
  ]
};

// Convert the object above into a flat array so our progress bar and saves work perfectly
let idCounter = 1;
const defaultChecklist = [];
for (const [category, tasks] of Object.entries(rawChecklistData)) {
  for (const text of tasks) {
    defaultChecklist.push({ id: idCounter++, category, text, completed: false });
  }
}

export default function PreCompChecklist() {
  const [checklist, setChecklist] = useState(() => {
    // Changed the key to _v2 so it doesn't conflict with your old data!
    const saved = localStorage.getItem("precomp_checklist_v2");
    return saved ? JSON.parse(saved) : defaultChecklist;
  });

  useEffect(() => localStorage.setItem("precomp_checklist_v2", JSON.stringify(checklist)), [checklist]);

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const resetChecklist = () => {
    if (window.confirm("Are you sure you want to uncheck all items for the next tournament?")) {
      setChecklist(checklist.map(item => ({ ...item, completed: false })));
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const readiness = Math.round((completedCount / checklist.length) * 100);

  // Extract unique categories to map through them in the UI
  const categories = [...new Set(checklist.map(item => item.category))];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <PlaneTakeoff size={40} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Pre-Comp Checklist</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>Too many times have we forgotten things pre-comp... so here's a highly technical checklist to ensure you never miss a beat. (Progress saves locally to your browser!)</p>
        </div>
      </div>

      <div className="os-window" style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Title Bar */}
        <div className="os-titlebar">
          <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
            <span className="os-dot dot-red"></span>
            <span className="os-dot dot-yellow"></span>
            <span className="os-dot dot-green"></span>
          </div>
          <ListChecks size={14} style={{ marginRight: '4px' }} /> pre_flight_diagnostics.sys
        </div>

        <div style={{ padding: '30px' }}>
          
          {/* Header & Reset Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--window-border)', paddingBottom: '20px', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '24px', fontWeight: '700' }}>Flight Check</h3>
            <button 
              onClick={resetChecklist} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--nav-hover)', border: '1px solid var(--window-border)', color: 'var(--text-main)', 
                padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', 
                transition: 'all 0.2s' 
              }} 
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }} 
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--window-border)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            >
              <RotateCcw size={16} /> Reset List
            </button>
          </div>

          {/* Big Progress Bar */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span>Tournament Readiness</span>
              <span style={{ color: readiness === 100 ? '#27c93f' : 'var(--text-main)' }}>{readiness}%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: 'var(--nav-hover)', height: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--window-border)' }}>
              <div style={{ 
                height: '100%', width: `${readiness}%`, 
                backgroundColor: readiness === 100 ? '#27c93f' : 'var(--accent)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s'
              }} />
            </div>
          </div>
          
          {/* The Categorized Interactive List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {categories.map((category) => (
              <div key={category}>
                
                {/* Category Title */}
                <h4 style={{ 
                  color: 'var(--accent)', 
                  marginBottom: '15px', 
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '1px solid var(--window-border)',
                  paddingBottom: '8px'
                }}>
                  {category}
                </h4>

                {/* Items in this Category */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {checklist.filter(item => item.category === category).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleChecklist(item.id)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '15px', padding: '14px 16px', 
                        backgroundColor: item.completed ? 'var(--window-bg)' : 'var(--nav-hover)', 
                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: item.completed ? 'var(--window-border)' : 'transparent',
                        borderLeft: item.completed ? '5px solid #27c93f' : '5px solid transparent',
                        opacity: item.completed ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => { if (!item.completed) e.currentTarget.style.transform = 'translateX(4px)' }}
                      onMouseLeave={(e) => { if (!item.completed) e.currentTarget.style.transform = 'translateX(0)' }}
                    >
                      <div style={{ 
                        width: '22px', height: '22px', borderRadius: '6px', border: '2px solid',
                        borderColor: item.completed ? '#27c93f' : 'var(--text-muted)',
                        backgroundColor: item.completed ? '#27c93f' : 'var(--window-bg)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        flexShrink: 0, transition: 'all 0.2s'
                      }}>
                        {item.completed && <Check size={14} color="#000" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '14px', textDecoration: item.completed ? 'line-through' : 'none', color: 'var(--text-main)', lineHeight: '1.4', fontWeight: '600' }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {readiness === 100 && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(39, 201, 63, 0.1)', border: '1px solid #27c93f', borderRadius: '8px', textAlign: 'center', color: '#27c93f', fontWeight: '700', fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <PlaneTakeoff size={24} /> All systems go! Good luck at the tournament!
            </div>
          )}

        </div>
      </div>
    </div>
  );
}