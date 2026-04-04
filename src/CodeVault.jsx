import { useState } from 'react';
import { Search, Copy, Check, Terminal, Code2, FileCode2 } from 'lucide-react';
import './index.css';

// 1. THE DUAL-LANGUAGE SNIPPET DATABASE
const snippets = [
  {
    id: 1,
    title: "Split Arcade Drive",
    category: "Drivetrain",
    description: "A competition-standard 2-joystick arcade control setup. Axis 3 controls forward/backward movement, while Axis 1 controls rotation. This provides highly intuitive maneuverability for tank-style drivetrains by separating speed and steering into different hands.",
    cpp: `// Split Arcade Drive Logic (Inside User Control)
int forward = Controller1.Axis3.position(percent);
int turn = Controller1.Axis1.position(percent);

LeftDrive.spin(vex::forward, forward + turn, percent);
RightDrive.spin(vex::forward, forward - turn, percent);`,
    python: `# Split Arcade Drive Logic (Inside User Control)
forward = controller_1.axis3.position()
turn = controller_1.axis1.position()

left_drive.spin(FORWARD, forward + turn, PERCENT)
right_drive.spin(FORWARD, forward - turn, PERCENT)`
  },
  {
    id: 2,
    title: "P-Loop (Proportional Control)",
    category: "Algorithms",
    description: "The foundational algorithm for autonomous movement. Instead of moving at 100% speed and abruptly slamming on the brakes, a P-Loop calculates the distance to the target (the 'error') and proportionally slows the motor down as it gets closer, ensuring smooth, accurate stops.",
    cpp: `// Proportional (P) Controller for an Arm
double kP = 0.5; // Tuning constant
double target = 500.0; // Target encoder ticks

while(true) {
  double currentPos = ArmMotor.position(degrees);
  double error = target - currentPos;
  double motorPower = error * kP;
  
  ArmMotor.spin(vex::forward, motorPower, percent);
  vex::task::sleep(20); // Prevent CPU lockup!
}`,
    python: `# Proportional (P) Controller for an Arm
kP = 0.5 # Tuning constant
target = 500.0 # Target encoder ticks

while True:
    current_pos = arm_motor.position(DEGREES)
    error = target - current_pos
    motor_power = error * kP
    
    arm_motor.spin(FORWARD, motor_power, PERCENT)
    wait(20, MSEC) # Prevent CPU lockup!`
  },
  {
    id: 3,
    title: "Pneumatic Single-Button Toggle",
    category: "Pneumatics",
    description: "A robust state-machine toggle. Rather than writing separate 'open' and 'close' buttons, this logic uses a boolean variable to track the cylinder's current state and flips it every time a single button is pressed, saving valuable controller space.",
    cpp: `// Pneumatic State Tracker
// tells the robot that the clamp is closed
bool isClampOpen = false;

void toggleClamp() {
  isClampOpen = !isClampOpen; // flips the boolean state
  ClampCylinder.set(isClampOpen);
}

// Registers the event inside int main() or initialization:
Controller1.ButtonA.pressed(toggleClamp);`,
    python: `# Pneumatic State Tracker
is_clamp_open = False

def toggle_clamp():
    global is_clamp_open
    is_clamp_open = not is_clamp_open # Flip the state
    clamp_cylinder.set(is_clamp_open)

# Register the event inside initialization:
controller_1.buttona.pressed(toggle_clamp)`
  },
  {
    id: 4,
    title: "Custom Team Brain Interface",
    category: "UI / Display",
    description: "Take pride in your build! This snippet uses the V5 Brain's built-in canvas drawing API to wipe the default white screen and render a custom dark-mode interface featuring your team number in large cyan text. Best placed inside your pre-autonomous setup.",
    cpp: `// Draw a styled team logo on the Brain
Brain.Screen.clearScreen();

// Draw a dark background rectangle (change the color)
Brain.Screen.setFillColor(vex::color(40, 40, 40));
Brain.Screen.drawRectangle(0, 0, 480, 240);

// Draw the Team Number in Cyan (change the color)
Brain.Screen.setFont(vex::fontType::prop60);
Brain.Screen.setPenColor(vex::color::cyan);
Brain.Screen.printAt(140, 120, "TEAM ______");

// Draw a subtitle (change the color)
Brain.Screen.setPenColor(vex::color::white);
Brain.Screen.printAt(155, 160, "___________");`,
    python: `# Draw a styled team logo on the Brain
brain.screen.clear_screen()

# Draw a dark background rectangle (change the color)
brain.screen.set_fill_color(Color(40, 40, 40))
brain.screen.draw_rectangle(0, 0, 480, 240)

# Draw the Team Number in Cyan (change the color)
brain.screen.set_font(FontType.PROP60)
brain.screen.set_pen_color(Color.CYAN)
brain.screen.print_at("TEAM _______", x=140, y=120)

# Draw a subtitle (change the color)
brain.screen.set_pen_color(Color.WHITE)
brain.screen.print_at("________", x=155, y=160)`
  }
];

// 2. INDIVIDUAL CARD COMPONENT
function SnippetCard({ snippet }) {
  const [language, setLanguage] = useState("cpp");
  const [copied, setCopied] = useState(false);

  const activeCode = language === "cpp" ? snippet.cpp : snippet.python;
  const fileExtension = language === "cpp" ? ".cpp" : ".py";
  const safeFilename = snippet.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') + fileExtension;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="os-window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Title Bar (Dynamic Filename!) */}
      <div className="os-titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', marginRight: '5px' }}>
            <span className="os-dot dot-red"></span>
            <span className="os-dot dot-yellow"></span>
            <span className="os-dot dot-green"></span>
          </div>
          <FileCode2 size={14} /> {safeFilename}
        </div>
      </div>

      {/* Header Area */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>{snippet.category}</span>
          <h3 style={{ margin: '5px 0 0 0', color: 'var(--text-main)', fontSize: '20px', fontWeight: '700' }}>{snippet.title}</h3>
        </div>
        <button 
          onClick={handleCopy}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 12px', borderRadius: '6px', border: 'none', fontWeight: '700', cursor: 'pointer',
            backgroundColor: copied ? '#27c93f' : 'var(--nav-hover)',
            color: copied ? '#000' : 'var(--text-main)',
            transition: 'all 0.2s', whiteSpace: 'nowrap'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />} 
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Description */}
      <div style={{ padding: '0 20px 20px 20px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', fontWeight: '600' }}>
        {snippet.description}
      </div>

      {/* Language Toggle Tabs */}
      <div style={{ display: 'flex', padding: '0 20px', gap: '10px', marginBottom: '-1px', zIndex: 1 }}>
        <button 
          onClick={() => setLanguage("cpp")}
          style={{ ...tabStyle, 
            backgroundColor: language === "cpp" ? '#0d1117' : 'transparent', 
            color: language === "cpp" ? '#38bdf8' : 'var(--text-muted)',
            borderBottom: language === "cpp" ? 'none' : '1px solid #333'
          }}
        >
          C++
        </button>
        <button 
          onClick={() => setLanguage("python")}
          style={{ ...tabStyle, 
            backgroundColor: language === "python" ? '#0d1117' : 'transparent', 
            color: language === "python" ? '#f59e0b' : 'var(--text-muted)',
            borderBottom: language === "python" ? 'none' : '1px solid #333'
          }}
        >
          Python
        </button>
      </div>

      {/* The Code Block (Forced Dark Mode to look like a Terminal) */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#0d1117', /* GitHub Dark Dim background */
        flex: 1, 
        overflowX: 'auto', 
        textAlign: 'left', 
        direction: 'ltr',
        borderTop: '1px solid #333'
      }}>
        <pre style={{ margin: 0, color: language === "cpp" ? '#4ade80' : '#fcd34d', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5', textAlign: 'left' }}>
          <code>{activeCode}</code>
        </pre>
      </div>
    </div>
  );
}

const tabStyle = { 
  padding: '8px 16px', border: '1px solid #333', borderBottom: 'none', 
  borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: '700', fontSize: '13px', 
  transition: 'all 0.2s', marginBottom: '-1px' 
};

// 3. THE MAIN PAGE COMPONENT
export default function CodeVault() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSnippets = snippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    snippet.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Code2 size={40} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Code Vault</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>Are you a new team, don't know how to code, or are someone simply tired of rewriting basic code structure? Well, i've got you covered! In my free time, I programed and gathered some basic code snippets for Python and C++ that you might need in your next program! While i can't say that everything 100% works, it all looks correct to me! use these code snippets free of charge! If you want to contribute to the vault then please drop your code in the message board!</p>
        </div>
      </div>

      {/* SEARCH WINDOW */}
      <div className="os-window" style={{ marginBottom: '30px' }}>
        <div className="os-titlebar">
          <span className="os-dot dot-red"></span>
          <span className="os-dot dot-yellow"></span>
          <span className="os-dot dot-green"></span>
          search_library.sh
        </div>
        <div style={{ padding: '20px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="os-input" 
            placeholder="Search snippets... (e.g., 'Drive', 'Pneumatics')" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* SNIPPETS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '25px' }}>
        {filteredSnippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
        
        {filteredSnippets.length === 0 && (
          <div className="os-window" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <Terminal size={48} color="var(--window-border)" />
            <div style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '16px' }}>
              No snippets found matching your search.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}