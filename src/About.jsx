import { 
  User, Code2, Palette, Sparkles, ExternalLink
} from 'lucide-react';
import './index.css';

export default function About() {
  const skills = [
    { name: "Development", icon: <Code2 size={16} />, color: "#38bdf8" },
    { name: "Illustration", icon: <Palette size={16} />, color: "#fb923c" },
    { name: "Animation", icon: <Sparkles size={16} />, color: "#f59e0b" }
  ];

  const headerLabelStyle = { margin: '0 0 10px 0', fontSize: '18px', color: 'var(--text-muted)', fontWeight: '600' };
  const bodyTextStyle = { lineHeight: '1.6', color: 'var(--text-main)', fontWeight: '600', marginBottom: '20px' };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <User size={40} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>About the Developer</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>yes! i am a human!</p>
        </div>
      </div>

      <div className="os-window">
        <div className="os-titlebar">
          <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
            <span className="os-dot dot-red"></span>
            <span className="os-dot dot-yellow"></span>
            <span className="os-dot dot-green"></span>
          </div>
          developer_profile.ext
        </div>

        <div style={{ padding: '40px', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '150px', height: '150px', borderRadius: '50%', 
              backgroundColor: 'var(--nav-hover)', border: '4px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '60px', marginBottom: '15px'
            }}>
              ❛ᴗ❛
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '34px', color: 'var(--text-main)', fontWeight: '700' }}>
              hi! you can call me <span style={{ color: 'var(--accent)' }}>programm3r</span>
            </h1>
            <p style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--text-muted)', fontWeight: '600' }}>
              notebooker, programmer, and developer.
            </p>
            
            <p style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: '20px' }}>
              ---------------------------------------------------------
            </p>

            {/* Section 1 */}
            <p style={headerLabelStyle}>who am i?</p>
            <p style={bodyTextStyle}>
              I'm a programmer and engineering notebooker for V5RC team 10410A!
            </p>

            {/* Section 2 */}
            <p style={headerLabelStyle}>why did i create this hub?</p>
            <p style={bodyTextStyle}>
              I built this Robotics Hub because I realized that despite how many kids compete in V5RC, there are so many things that could make our experience as roboticists better! I wanted to create a tool that could help teams stay organized, share knowledge, and have fun with robotics!
            </p>

            {/* Section 3 */}
            <p style={headerLabelStyle}>how did i build this hub?</p>
            <p style={bodyTextStyle}>
              Honestly, it was a learning curve. I really wanted to create something new, something I hadn't done before, so I decided to learn JavaScript. I still don't fully understand everything, but if you are interested in developing a website, I would recommend using Gemini as a guide. Ask it lots of questions, and really try to figure out how things work! I also used a lot of online resources, like Stack Overflow, W3schools, and YouTube tutorials. It took a lot of trial and error, but it was worth it!
            </p>

            <p style={bodyTextStyle}>
             
            </p>
            
            <p style={headerLabelStyle}>come check me out :D</p>


            <p style={bodyTextStyle}>
             Here is the link to my GitHub - Please don't mind if it's empty, it's a work in process! - https://github.com/botW-programmer
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}