import { useState, useEffect } from 'react';
import { PlaneTakeoff, RotateCcw, Check, ListChecks } from 'lucide-react';
import './index.css';

// The Ultimate Pre-Competition Packing & Prep List
const defaultChecklist = [
  { id: 1, text: "All V5 Robot Batteries fully charged (including spares)", completed: false },
  { id: 2, text: "V5 Controllers fully charged and paired to Brain", completed: false },
  { id: 3, text: "Firmware updated to the latest version on Brain & Controller", completed: false },
  { id: 4, text: "Latest competition code downloaded to Brain and tested", completed: false },
  { id: 5, text: "Code backed up to GitHub or a physical flash drive", completed: false },
  { id: 6, text: "Physical Engineering Notebook packed", completed: false },
  { id: 7, text: "Safety glasses packed for EVERY team member", completed: false },
  { id: 8, text: "Toolbox packed (Hex keys, wrenches, zip-ties, tape, cutters)", completed: false },
  { id: 9, text: "Spare parts packed (Motors, extra C-channel, screws, nuts)", completed: false },
  { id: 10, text: "All smart cables fully seated and zip-tied away from gears/wheels", completed: false },
  { id: 11, text: "Robot dimensions verified (Fits strictly within 18\"x18\"x18\")", completed: false },
  { id: 12, text: "License plates packed (Both Red and Blue)", completed: false },
  { id: 13, text: "Participant Consent Forms and Team Roster printed", completed: false },
];

export default function PreCompChecklist() {
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("precomp_checklist");
    return saved ? JSON.parse(saved) : defaultChecklist;
  });

  useEffect(() => localStorage.setItem("precomp_checklist", JSON.stringify(checklist)), [checklist]);

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

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <PlaneTakeoff size={40} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Pre-Comp Checklist</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>too many times have i forgotten things pre-comp... so here's a handy pre-comp checklist to ensure you don't miss anything! it doesn't save once you exit the web app though...</p>
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
          <div style={{ marginBottom: '30px' }}>
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
          
          {/* The Interactive List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {checklist.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleChecklist(item.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '15px', padding: '16px 20px', 
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
                  width: '24px', height: '24px', borderRadius: '6px', border: '2px solid',
                  borderColor: item.completed ? '#27c93f' : 'var(--text-muted)',
                  backgroundColor: item.completed ? '#27c93f' : 'var(--window-bg)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  flexShrink: 0, transition: 'all 0.2s'
                }}>
                  {item.completed && <Check size={16} color="#000" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '15px', textDecoration: item.completed ? 'line-through' : 'none', color: 'var(--text-main)', lineHeight: '1.4', fontWeight: '600' }}>
                  {item.text}
                </span>
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