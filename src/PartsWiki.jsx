import { useState } from 'react';
import { Search, Filter, Info, ExternalLink, Box } from 'lucide-react';
import './index.css';

// 1. THE ULTIMATE "MEGA-DATABASE" (Fully Expanded)
const vexParts = [
  // --- ELECTRONICS ---
  { 
    id: 1, name: "V5 Robot Brain", category: "Electronics", price: "$384.99", 
    link: "https://www.vexrobotics.com/276-4810.html",
    desc: "The central processing unit of the V5 system with a full-color touch screen.",
    specs: { Ports: "21 Smart, 8 3-Wire", Screen: "4.25\" Full Color", Weight: "1.50 lbs (680g)", Processor: "Cortex A9" }
  },
  { 
    id: 2, name: "V5 Controller", category: "Electronics", price: "$137.39", 
    link: "https://www.vexrobotics.com/276-4820.html",
    desc: "The primary interface for driver control, featuring haptic feedback and a screen.",
    specs: { Battery: "Rechargeable Li-Ion", Screen: "Monochrome LCD", Connection: "VEXnet / Bluetooth", Weight: "0.85 lbs (385g)" }
  },
  { 
    id: 3, name: "V5 Robot Battery", category: "Electronics", price: "$76.99", 
    link: "https://www.vexrobotics.com/276-4811.html",
    desc: "Provides consistent 12.8V power to the V5 Brain, ensuring no performance drop off.",
    specs: { Voltage: "12.8V", Chemistry: "Li-Ion", Capacity: "1100 mAh", Weight: "1.06 lbs (480g)" }
  },
  { 
    id: 4, name: "V5 Robot Radio", category: "Electronics", price: "$48.79", 
    link: "https://www.vexrobotics.com/276-4831.html",
    desc: "Enables wireless communication between the V5 Brain and Controller.",
    specs: { Connection: "VEXnet 3 / Bluetooth", Indicator: "LED Status", Mount: "Snap-in", Weight: "0.06 lbs (27g)" }
  },

  // --- MOTORS ---
  { 
    id: 5, name: "V5 Smart Motor (11W)", category: "Motion", price: "$49.99", 
    link: "https://www.vexrobotics.com/276-4840.html",
    desc: "Provides powerful continuous rotation with a built-in high-resolution encoder.",
    specs: { Power: "11 Watts", Max_RPM: "600 RPM (with cartridge)", Encoder: "Built-in Absolute", Weight: "0.34 lbs (154g)" }
  },
  { 
    id: 6, name: "EXP Smart Motor (5.5W)", category: "Motion", price: "$33.49", 
    link: "https://www.vexrobotics.com/276-4842.html",
    desc: "Half-power motor perfectly sized for intakes, conveyors, and low-torque mechanisms.",
    specs: { Power: "5.5 Watts", Max_RPM: "600 RPM (with cartridge)", Encoder: "Built-in Absolute", Weight: "0.17 lbs (77g)" }
  },
  { 
    id: 7, name: "V5 Motor Gear Cartridge", category: "Motion", price: "$13.29", 
    link: "https://www.vexrobotics.com/276-4840.html",
    desc: "Replacement cartridges for V5 Smart Motors to change the internal gear ratio.",
    specs: { Speed: "100, 200, or 600 RPM", Torque: "Varies", Color: "Red, Green, Blue", Weight: "0.05 lbs (23g)" }
  },

  // --- SENSORS ---
  { 
    id: 8, name: "Inertial Sensor", category: "Sensors", price: "$55.49", 
    link: "https://www.vexrobotics.com/276-4855.html",
    desc: "A combination 3-axis accelerometer and 3-axis gyroscope for precise heading.",
    specs: { Gyro: "3-Axis", Accelerometer: "3-Axis", Update_Rate: "High Speed", Weight: "0.06 lbs (27g)" }
  },
  { 
    id: 9, name: "Optical Sensor", category: "Sensors", price: "$49.99", 
    link: "https://www.vexrobotics.com/276-7126.html",
    desc: "Measures ambient light, color, proximity, and gesture detection.",
    specs: { Light: "Ambient & Color", Proximity: "Yes", LED: "Built-in White", Weight: "0.05 lbs (23g)" }
  },
  { 
    id: 10, name: "AI Vision Sensor", category: "Sensors", price: "$95.49", 
    link: "https://www.vexrobotics.com/276-8659.html",
    desc: "Tracks up to 7 individual colors, AprilTags, or AI game objects simultaneously.",
    specs: { Resolution: "640x400", Tracking: "Colors/AprilTags", FPS: "30 frames/sec", Weight: "0.16 lbs (72g)" }
  },
  { 
    id: 11, name: "Rotation Sensor", category: "Sensors", price: "$39.99", 
    link: "https://www.vexrobotics.com/276-6050.html",
    desc: "Measures shaft rotation with extremely high precision.",
    specs: { Resolution: "3600 ticks/rev", Max_Speed: "1000 RPM", Type: "Absolute Angle", Weight: "0.07 lbs (32g)" }
  },
  { 
    id: 12, name: "Distance Sensor", category: "Sensors", price: "$39.99", 
    link: "https://www.vexrobotics.com/276-4854.html",
    desc: "Uses a safe laser to measure distance to an object and detect object size.",
    specs: { Range: "20mm to 2000mm", Laser: "Class 1", Output: "Millimeters", Weight: "0.05 lbs (23g)" }
  },
  { 
    id: 13, name: "Bumper Switch v2", category: "Sensors", price: "$12.99", 
    link: "https://www.vexrobotics.com/276-4852.html",
    desc: "Rugged mechanical switch for detecting physical contact. (2-pack)",
    specs: { Type: "Digital", Actuation: "Physical Press", Quantity: "Pack of 2", Weight: "0.03 lbs (14g) each" }
  },

  // --- MOTION & PNEUMATICS ---
  { 
    id: 14, name: "High Strength Gear Kit", category: "Motion", price: "$29.99", 
    link: "https://www.vexrobotics.com/276-2250.html",
    desc: "Includes 12T, 36T, 60T, and 84T gears for custom power transmission.",
    specs: { Material: "Plastic", Pitch: "Standard VEX", Includes: "Inserts & Spacers", Weight: "0.45 lbs (Kit)" }
  },
  { 
    id: 15, name: "Standard Chain Add-on Pack", category: "Motion", price: "$22.25", 
    link: "https://www.vexrobotics.com/276-2252.html",
    desc: "Standard width chain for transferring power between sprockets in low-torque mechanisms.",
    specs: { Links: "326 Links", Length: "48 inches", Max_Load: "Low/Medium", Weight: "0.008 lbs/ft" }
  },
  { 
    id: 16, name: "High Strength Chain", category: "Motion", price: "$30.89", 
    link: "https://www.vexrobotics.com/276-2252.html",
    desc: "Reinforced, wider chain designed to lift heavy loads and withstand high-stress impacts.",
    specs: { Links: "140 Links", Max_Load: "Up to 50 lbs", Includes: "Attachment Links", Weight: "0.032 lbs/ft" }
  },
  { 
    id: 17, name: "V5 Pneumatics Kit", category: "Pneumatics", price: "$299.99", 
    link: "https://www.vexrobotics.com/276-8750.html",
    desc: "Everything needed to power linear actuators using compressed air.",
    specs: { Max_Pressure: "100 psi", Cylinders: "2x Double Acting", Reservoir: "200mL", Weight: "1.20 lbs (Kit)" }
  },
  { 
    id: 18, name: "Pneumatic Tubing", category: "Pneumatics", price: "$14.99", 
    link: "https://www.vexrobotics.com/276-8750.html",
    desc: "5/32\" OD Polyurethane tubing for routing air between pneumatics components.",
    specs: { Outer_Diameter: "5/32\"", Length: "10 feet", Material: "Polyurethane", Max_Pressure: "150 psi" }
  },

  // --- WHEELS ---
  { 
    id: 19, name: "4\" Mecanum Wheel", category: "Wheels", price: "$68.99", 
    link: "https://www.vexrobotics.com/276-1447.html",
    desc: "Features angled rollers that allow a robot to strafe side-to-side without turning. (4-pack)",
    specs: { Diameter: "4 inches", Type: "Mecanum", Quantity: "Pack of 4", Weight: "0.41 lbs (186g) each" }
  },
  { 
    id: 20, name: "3.25\" Omni-Directional Wheel", category: "Wheels", price: "$24.99", 
    link: "https://www.vexrobotics.com/omni-wheels.html",
    desc: "Rolls forward like a normal wheel, but slides sideways with zero friction. (2-pack)",
    specs: { Rollers: "14 per wheel", Diameter: "3.25 inches", Quantity: "Pack of 2", Weight: "0.25 lbs (113g) each" }
  },
  { 
    id: 21, name: "4\" Omni-Directional Wheel", category: "Wheels", price: "$29.99", 
    link: "https://www.vexrobotics.com/omni-wheels.html",
    desc: "Large omni wheels for higher top speed and traversing obstacles. (2-pack)",
    specs: { Rollers: "18 per wheel", Diameter: "4 inches", Quantity: "Pack of 2", Weight: "0.33 lbs (150g) each" }
  },
  { 
    id: 22, name: "2.75\" Omni-Directional Wheel", category: "Wheels", price: "$19.99", 
    link: "https://www.vexrobotics.com/omni-wheels.html",
    desc: "Compact omni wheels perfect for tracking wheels or low-profile drivetrains. (2-pack)",
    specs: { Rollers: "14 per wheel", Diameter: "2.75 inches", Quantity: "Pack of 2", Weight: "0.15 lbs (68g) each" }
  },
  { 
    id: 23, name: "3.25\" Traction Wheel", category: "Wheels", price: "$19.99", 
    link: "https://www.vexrobotics.com/traction-wheels.html",
    desc: "High friction rubber tire designed to maximize pushing power. (2-pack)",
    specs: { Diameter: "3.25 inches", Tread: "Rubber", Quantity: "Pack of 2", Weight: "0.20 lbs (90g) each" }
  },
  { 
    id: 24, name: "3.25\" Flex Wheel (45A)", category: "Wheels", price: "$19.99", 
    link: "https://www.vexrobotics.com/flex-wheels.html",
    desc: "Squishy, compliant wheels perfect for intakes and flywheels. (4-pack)",
    specs: { Durometer: "45A (Medium)", Diameter: "3.25 inches", Quantity: "Pack of 4", Weight: "0.15 lbs (68g) each" }
  },

  // --- STRUCTURE ---
  { 
    id: 25, name: "Aluminum C-Channel (1x2x1x35)", category: "Structure", price: "$44.69", 
    link: "https://www.vexrobotics.com/aluminum-kits.html",
    desc: "Lightweight structural foundation for building custom chassis and mechanisms. (6-pack)",
    specs: { Material: "Aluminum", Dimensions: "1x2x1x35 holes", Quantity: "Pack of 6", Weight: "0.13 lbs (59g) each" }
  },
  { 
    id: 26, name: "Aluminum C-Channel (1x3x1x35)", category: "Structure", price: "$49.99", 
    link: "https://www.vexrobotics.com/aluminum-kits.html",
    desc: "Wider C-Channel for building rigid towers and lift arms. (6-pack)",
    specs: { Material: "Aluminum", Dimensions: "1x3x1x35 holes", Quantity: "Pack of 6", Weight: "0.18 lbs (81g) each" }
  },
  { 
    id: 27, name: "Aluminum Angle (2x2x35)", category: "Structure", price: "$34.99", 
    link: "https://www.vexrobotics.com/aluminum-kits.html",
    desc: "L-shaped aluminum great for bracing and cross-supports. (6-pack)",
    specs: { Material: "Aluminum", Dimensions: "2x2x35 holes", Quantity: "Pack of 6", Weight: "0.11 lbs (50g) each" }
  },
  { 
    id: 28, name: "1\" Standoffs", category: "Structure", price: "$9.99", 
    link: "https://www.vexrobotics.com/standoffs.html",
    desc: "Threaded hexagonal pillars used to space metal plates apart rigidly. (10-pack)",
    specs: { Length: "1 inch", Thread: "#8-32", Material: "Aluminum", Quantity: "Pack of 10" }
  },

  // --- HARDWARE ---
  { 
    id: 29, name: "Star Drive Screws 1/2\"", category: "Hardware", price: "$12.99", 
    link: "https://www.vexrobotics.com/screws.html",
    desc: "Resist stripping better than hex screws. Standard VEX competition thread. (100-pack)",
    specs: { Thread: "#8-32", Length: "0.50\"", Head: "T15 Star", Quantity: "Pack of 100" }
  },
  { 
    id: 30, name: "Nylock Nuts", category: "Hardware", price: "$11.99", 
    link: "https://www.vexrobotics.com/nuts.html",
    desc: "Features a nylon insert that grips the screw thread to prevent vibrating loose. (100-pack)",
    specs: { Thread: "#8-32", Type: "Nylon Insert", Material: "Steel/Nylon", Quantity: "Pack of 100" }
  },
  { 
    id: 31, name: "Keps Nuts", category: "Hardware", price: "$9.99", 
    link: "https://www.vexrobotics.com/nuts.html",
    desc: "Features an attached star washer to bite into metal. Faster to tighten than Nylocks. (100-pack)",
    specs: { Thread: "#8-32", Type: "Toothed Lock Washer", Material: "Steel", Quantity: "Pack of 100" }
  },
  { 
    id: 32, name: "High Strength Shafts", category: "Hardware", price: "$24.99", 
    link: "https://www.vexrobotics.com/shafts.html",
    desc: "0.25\" thick steel shafts for high-torque applications. Requires HS bearings.",
    specs: { Diameter: "0.25 inches", Lengths: "Various", Material: "Steel", Quantity: "Pack of 16" }
  },
  { 
    id: 33, name: "Bearing Flats", category: "Hardware", price: "$9.99", 
    link: "https://www.vexrobotics.com/bearings.html",
    desc: "Mounts to structure to allow 1/8\" shafts to spin smoothly. (10-pack)",
    specs: { Type: "Standard (1/8\")", Material: "Delrin Plastic", Holes: "3", Quantity: "Pack of 10" }
  },
  { 
    id: 34, name: "Shaft Collars", category: "Hardware", price: "$14.99", 
    link: "https://www.vexrobotics.com/collars.html",
    desc: "Locks onto a shaft using a set screw to prevent the shaft from sliding out. (16-pack)",
    specs: { Type: "Metal Set Screw", Fits: "0.125\" Shaft", Material: "Steel", Quantity: "Pack of 16" }
  },
  { 
    id: 35, name: "Teflon Washers", category: "Hardware", price: "$5.99", 
    link: "https://www.vexrobotics.com/washers.html",
    desc: "Ultra-low friction washers placed between moving metal parts to prevent grinding. (100-pack)",
    specs: { Material: "PTFE (Teflon)", Thickness: "0.04 inches", Fits: "0.125\" Shafts", Quantity: "Pack of 100" }
  }
];

const categories = ["All", "Electronics", "Motion", "Sensors", "Pneumatics", "Wheels", "Structure", "Hardware"];

export default function PartsWiki() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPart, setSelectedPart] = useState(null);

  const filteredParts = vexParts.filter((part) => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || part.category === selectedCategory;
    return matchesSearch && matchesCategory; 
  });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Box size={40} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Parts Wiki</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>The parts wiki is essentially a prettier and better way to view the specs of different V5 parts! If you want any parts added to the list, please paste the link in the message board!</p>
        </div>
      </div>

      {/* SEARCH & FILTERS WINDOW */}
      <div className="os-window" style={{ marginBottom: '30px' }}>
        <div className="os-titlebar">
          <span className="os-dot dot-red"></span>
          <span className="os-dot dot-yellow"></span>
          <span className="os-dot dot-green"></span>
          search_filters.sys
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="os-input" 
              placeholder="Search hardware..." 
              style={{ paddingLeft: '40px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} color="var(--text-muted)" style={{ marginRight: '5px' }} />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                  backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--nav-hover)',
                  color: selectedCategory === cat ? '#000' : 'var(--text-main)',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredParts.map(part => (
          <div 
            key={part.id} 
            className="os-window" 
            onClick={() => setSelectedPart(part)}
            style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className="os-titlebar" style={{ fontSize: '12px' }}>
              {part.category.toLowerCase()}.part
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{part.name}</h3>
              <p style={{ margin: '0 0 15px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', lineHeight: '1.4' }}>
                {part.desc}
              </p>
              <div style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {part.price}
                <Info size={18} />
              </div>
            </div>
          </div>
        ))}
        {filteredParts.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', gridColumn: '1 / -1', padding: '20px' }}>
            No parts found matching your search.
          </div>
        )}
      </div>

      {/* BLUEPRINT MODAL */}
      {selectedPart && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }} onClick={() => setSelectedPart(null)}>
          <div className="os-window" style={{ width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="os-titlebar">
              <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
                <span className="os-dot dot-red" onClick={() => setSelectedPart(null)} style={{ cursor: 'pointer' }}></span>
                <span className="os-dot dot-yellow"></span>
                <span className="os-dot dot-green"></span>
              </div>
              part_blueprint.view
            </div>
            <div style={{ padding: '30px' }}>
              <h2 style={{ margin: '0 0 15px 0', color: 'var(--text-main)' }}>{selectedPart.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.6', marginBottom: '25px' }}>{selectedPart.desc}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                {Object.entries(selectedPart.specs).map(([key, value]) => (
                  <div key={key}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>{key.replace('_', ' ')}</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '2px dashed var(--window-border)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>{selectedPart.price}</div>
                <a href={selectedPart.link} target="_blank" rel="noreferrer" style={{ backgroundColor: 'var(--accent)', color: '#000', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  VEX Store <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}