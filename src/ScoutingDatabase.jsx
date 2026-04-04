import { useState } from 'react';
import { Database, ClipboardPen, Trophy, Download, Gamepad2, Medal } from 'lucide-react';
import './index.css';

export default function ScoutingDatabase() {
  const [activeTab, setActiveTab] = useState("form");
  const [teams, setTeams] = useState([]);

  const [teamNumber, setTeamNumber] = useState("");
  const [auto, setAuto] = useState("Unknown");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (!teamNumber) {
      alert("Please enter a Team Number!");
      return;
    }

    let calculatedScore = 0; 
    if (auto === "Win") calculatedScore += 10;
    if (auto === "Tie") calculatedScore += 5;

    const newReport = {
      id: Date.now(),
      teamNumber,
      auto,
      notes,
      powerScore: calculatedScore
    };

    setTeams([...teams, newReport]);
    setTeamNumber("");
    setAuto("Unknown");
    setNotes("");
    
    setActiveTab("leaderboard");
  };

  const sortedTeams = [...teams].sort((a, b) => b.powerScore - a.powerScore);

  const exportToCSV = () => {
    if (teams.length === 0) {
      alert("No data to export yet!");
      return;
    }

    const headers = ["Rank", "Team Number", "Auto Consistency", "Power Score", "Scouter Notes"];
    
    const rows = sortedTeams.map((team, index) => [
      index + 1,
      team.teamNumber,
      team.auto,
      team.powerScore,
      `"${team.notes.replace(/"/g, '""')}"` 
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Scouting_Data_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER & NAVIGATION */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Database size={40} color="var(--accent)" />
          <div>
            <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Scouting DB</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>During competitions, picking an alliance partner is difficult... so I created a program that picks one for you! Just fill in the necessary information for each team, click on the leaderboard tab, and BOOM; you have your ideal alliance partner! Please note that this does not save when you close the web app - I sadly haven't figured out how to do that yet :D</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* OS-Style Tab Switcher */}
          <div style={{ display: 'flex', gap: '5px', backgroundColor: 'var(--window-bg)', padding: '6px', borderRadius: '10px', border: '1px solid var(--window-border)' }}>
            <button 
              onClick={() => setActiveTab("form")}
              style={activeTab === "form" ? activeTabStyle : inactiveTabStyle}
            >
              <ClipboardPen size={16} /> New Report
            </button>
            <button 
              onClick={() => setActiveTab("leaderboard")}
              style={activeTab === "leaderboard" ? activeTabStyle : inactiveTabStyle}
            >
              <Trophy size={16} /> Leaderboard
            </button>
          </div>

          <button 
            onClick={exportToCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* --- VIEW 1: DATA ENTRY FORM --- */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="os-window" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="os-titlebar">
            <span className="os-dot dot-red"></span>
            <span className="os-dot dot-yellow"></span>
            <span className="os-dot dot-green"></span>
            data_entry.exe
          </div>

          <div style={{ padding: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>Team Number</label>
                <input type="text" className="os-input" placeholder="e.g. 99999A" value={teamNumber} onChange={e => setTeamNumber(e.target.value)} />
              </div>
              
              <div>
                <label style={labelStyle}>Autonomous Consistency</label>
                <select className="os-input" value={auto} onChange={e => setAuto(e.target.value)}>
                  <option value="Unknown">Unknown</option>
                  <option value="Loss">Loss</option>
                  <option value="Tie">Tie</option>
                  <option value="Win">Win</option>
                </select>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--nav-hover)', border: '2px dashed var(--window-border)', borderRadius: '8px', padding: '25px', textAlign: 'center', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Gamepad2 size={24} color="var(--text-muted)" />
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: 'var(--text-main)' }}>2026-2027 Game Specifics</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>New scoring inputs (game objects, endgame mechanics) will be added here after the game reveal!</p>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>Scouter Notes</label>
              <textarea 
                className="os-input"
                placeholder="What are their strengths/weaknesses? Do they play defense?" 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                style={{ minHeight: '120px', resize: 'vertical' }} 
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--text-main)', color: 'var(--window-bg)', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              Save Scouting Report
            </button>
          </div>
        </form>
      )}

      {/* --- VIEW 2: LEADERBOARD --- */}
      {activeTab === "leaderboard" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sortedTeams.map((team, index) => (
            <div key={team.id} className="os-window" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              <div className="os-titlebar" style={{ backgroundColor: index === 0 ? 'var(--accent)' : 'var(--titlebar-bg)', color: index === 0 ? '#000' : 'var(--titlebar-text)' }}>
                <span className="os-dot dot-red"></span>
                <span className="os-dot dot-yellow"></span>
                <span className="os-dot dot-green"></span>
                team_{team.teamNumber.toLowerCase()}.dat
              </div>

              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                {/* Rank Badge */}
                <div style={{ width: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--nav-hover)', borderRight: '1px solid var(--window-border)' }}>
                  {index === 0 && <Medal size={24} color="var(--accent)" style={{ marginBottom: '5px' }} />}
                  <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>#{index + 1}</span>
                </div>

                {/* Team Data */}
                <div style={{ flex: 1, padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', alignItems: 'center' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '22px', color: 'var(--text-main)', fontWeight: '700' }}>{team.teamNumber}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.4' }}>"{team.notes}"</p>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Auto</div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: team.auto === "Win" ? '#27c93f' : 'var(--text-main)' }}>{team.auto}</div>
                  </div>

                  <div style={{ borderLeft: '2px dashed var(--window-border)', paddingLeft: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Power Score</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent)' }}>{team.powerScore}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {teams.length === 0 && (
            <div className="os-window" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <Database size={48} color="var(--window-border)" />
              <div style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '16px' }}>
                No teams scouted yet. Start entering data!
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// Styling objects mapped to our CSS Variables
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const activeTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none', borderRadius: '6px', backgroundColor: 'var(--text-main)', color: 'var(--window-bg)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' };
const inactiveTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none', borderRadius: '6px', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' };