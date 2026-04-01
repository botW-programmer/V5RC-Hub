import { Link } from 'react-router-dom';
import { 
  BookOpen, Settings, Trophy, Code, 
  PlaneTakeoff, MessageSquare, User, Gamepad2
} from 'lucide-react';
import './index.css'; 

export default function Home() {
  const tools = [
    { 
      name: "Parts Wiki", 
      path: "/wiki", 
      icon: <BookOpen size={48} strokeWidth={1.5} />, 
      desc: "Search the ultimate V5RC hardware database." 
    },
    { 
      name: "Gear Calculator", 
      path: "/calculator", 
      icon: <Settings size={48} strokeWidth={1.5} />, 
      desc: "Calculate theoretical top speeds and custom gear ratios." 
    },
    { 
      name: "Scouting DB", 
      path: "/scouting", 
      icon: <Trophy size={48} strokeWidth={1.5} />, 
      desc: "Track match data and export your Pick List to CSV." 
    },
    { 
      name: "Code Vault", 
      path: "/vault", 
      icon: <Code size={48} strokeWidth={1.5} />, 
      desc: "Copy and paste competition-tested code snippets." 
    },
    { 
      name: "Pre-Comp Checklist", 
      path: "/checklist", 
      icon: <PlaneTakeoff size={48} strokeWidth={1.5} />, 
      desc: "Verify hardware and software before a tournament." 
    },
    { 
      name: "Message Board", 
      path: "/messages", 
      icon: <MessageSquare size={48} strokeWidth={1.5} />, 
      desc: "Leave recommendations, build tips, or feature requests." 
    },
    { 
      name: "Rover Sandbox", 
      path: "/sandbox", 
      icon: <Gamepad2 size={48} strokeWidth={1.5} />, 
      desc: "Test custom drive physics in a 2D simulation." 
    },
    { 
      name: "About Me", 
      path: "/about", 
      icon: <User size={48} strokeWidth={1.5} />, 
      desc: "Meet the creator behind the Robotics Hub." 
    }
  ];

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', fontWeight: '700' }}>
          hi! i'm <span style={{ color: 'var(--accent)' }}>robotics hub</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
          your team's digital command center.
        </p>

        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
         ------------------------------------------------------------------------------------
        </p>
        
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
          everything here is free to use! i recommend bookmarking this site and sharing it with your teammates and other V5RC teams.
        </p>

        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
         ------------------------------------------------------------------------------------
        </p>
        
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
          if you have any suggestions or find a bug, please leave a note on the <Link to="/messages" style={{ color: 'var(--accent)', fontWeight: '600' }}>Message Board</Link> - if it's doable, it'll be done!
        </p>

        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
         ------------------------------------------------------------------------------------
        </p>

        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
          before i forget! feel free to use excerpts of this web app in your engineering notebooks!
        </p>

      </div>

      {/* --- TOOL GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        {tools.map((tool) => (
          <Link key={tool.name} to={tool.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            
            <div className="os-window" style={{ height: '100%', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }} 
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {/* OS TITLE BAR */}
              <div className="os-titlebar">
                <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
                  <span className="os-dot dot-red"></span>
                  <span className="os-dot dot-yellow"></span>
                  <span className="os-dot dot-green"></span>
                </div>
                {tool.name.toLowerCase().replace(/\s+/g, '_')}.exe
              </div>

              {/* CARD CONTENT */}
              <div style={{ padding: '30px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-main)', marginBottom: '15px' }}>
                  {tool.icon}
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '700' }}>{tool.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', fontWeight: '600', lineHeight: '1.5' }}>
                  {tool.desc}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}