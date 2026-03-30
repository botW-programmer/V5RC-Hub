import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  Sun, Moon, Bot, Home as HomeIcon, BookOpen, 
  Settings, Trophy, Code, PlaneTakeoff, FlaskConical, 
  MessageSquare, User 
} from 'lucide-react';
import './index.css'; 

import Home from './Home';
import RoverSandbox from './RoverSandbox';
import PartsWiki from './PartsWiki'; 
import GearCalculator from './GearCalculator';
import ScoutingDatabase from './ScoutingDatabase';
import CodeVault from './CodeVault';
import PreCompChecklist from './PreCompChecklist';
import MessageBoard from './MessageBoard';
import About from './About'; 


export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const iconAlign = { display: 'flex', alignItems: 'center', gap: '10px' };

  return (
    <BrowserRouter>
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
          {theme === 'light' ? <Sun size={28} /> : <Moon size={28} />}
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', padding: '20px', boxSizing: 'border-box', gap: '20px', paddingTop: '70px' }}>
        <div className="os-window" style={{ width: '260px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)', position: 'sticky', top: '70px' }}>
          <div className="os-titlebar">
            <span className="os-dot dot-red"></span><span className="os-dot dot-yellow"></span><span className="os-dot dot-green"></span>
            nav.sys
          </div>
          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/" className="nav-link"><span style={iconAlign}><HomeIcon size={18} /> Home</span></Link>
              <Link to="/wiki" className="nav-link"><span style={iconAlign}><BookOpen size={18} /> Wiki</span></Link>
              <Link to="/calculator" className="nav-link"><span style={iconAlign}><Settings size={18} /> Calc</span></Link>
              <Link to="/scouting" className="nav-link"><span style={iconAlign}><Trophy size={18} /> Scouting</span></Link>
              <Link to="/vault" className="nav-link"><span style={iconAlign}><Code size={18} /> Vault</span></Link>
              <Link to="/checklist" className="nav-link"><span style={iconAlign}><PlaneTakeoff size={18} /> Checklist</span></Link>
              <Link to="/messages" className="nav-link"><span style={iconAlign}><MessageSquare size={18} /> Messages</span></Link>
              <Link to="/about" className="nav-link"><span style={iconAlign}><User size={18} /> About Me</span></Link>
            </nav>
          </div>
        </div>

        <div style={{ flex: 1 }}> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wiki" element={<PartsWiki />} />
            <Route path="/calculator" element={<GearCalculator />} />
            <Route path="/scouting" element={<ScoutingDatabase />} />
            <Route path="/vault" element={<CodeVault />} />
            <Route path="/checklist" element={<PreCompChecklist />} />
            <Route path="/sandbox" element={<RoverSandbox />} />
            <Route path="/messages" element={<MessageBoard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}