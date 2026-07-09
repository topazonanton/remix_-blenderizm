import React, { useState } from 'react';
import { Camera, Sliders, RefreshCw, Layers2, Sparkles } from 'lucide-react';

export default function RenderSimulator() {
  const [exposure, setExposure] = useState(100); // 50 to 150
  const [warmth, setWarmth] = useState(0); // -50 (cold) to 50 (warm)
  const [aperture, setAperture] = useState(1.4); // 1.4 to 16 (controls blur)
  const [activePreset, setActivePreset] = useState('window'); // 'window' or 'corridor'

  const presets = {
    window: {
      name: 'Ponderosa Pine Profile',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTloPqBsr725UMO1vSnUtGg5p1ZZan-Hmkxg03L30AbZNBXGmWLbkIwU03H8UQ9ZhIjvcmDwV3OhQP3M3O3nVp531AW9TAcMhqIArhAGg_7Lc-Pm5VbEuehp780ncKYZts2FWFSX456X68PXzra4PBQ9e2Sn3PVkDDgQzwal5EYB-_LPyzXd9oiDkZCud2IshQ6FIecxfPNTWAoUFnBeNDF68cqTwJykx4FIVpykwkO2lvKfKbeCjHfpu2mYtMkTIsVemKJ5ittlU',
      description: 'Macro studio rendering of Triple-pane passive window structure. Note glass refraction index.',
      baseExposure: 100,
      baseWarmth: 15
    },
    corridor: {
      name: 'The Volumetric Basement',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxXP0ZGhCfagcCQbzk--TDfALFQng84N7DqUOju8iD2wySwuMqdgzxNvCxV8NWqan_-_XygrLYhrPw1N73xC3AjOHJ8hkYW5K-eOllTlCywYgNMP06RYphYmSBeNcPCyEhuY2W0XAgq2E6SeKVGyJphjTZ_tNrxl9Qrtgxy7KtcHaBts3Pugko3x0UTDAcaHpNSUfDiNLAaHIql-12wcePvxv-qVItGYNq0nufki7vXEUx8Ddg56WUhgmntl2JFIuzhmJstFY1LyQ',
      description: 'Cinematic volumetric corridor with heavy depth-of-field blur and damp concrete reflections.',
      baseExposure: 85,
      baseWarmth: -10
    }
  };

  const selected = presets[activePreset as keyof typeof presets] || presets.window;

  const handleReset = () => {
    setExposure(selected.baseExposure);
    setWarmth(selected.baseWarmth);
    setAperture(2.8);
  };

  // Convert aperture to blur radius. Lower aperture (e.g. f/1.4) = shallower depth of field = more blur
  // f/1.4 -> ~6px blur. f/16 -> 0px blur
  const calculateBlur = () => {
    if (aperture >= 11) return 0;
    if (aperture >= 5.6) return 1;
    if (aperture >= 2.8) return 3;
    return 5; // f/1.4
  };

  const calculateStyle = (): React.CSSProperties => {
    const brightness = exposure / 100;
    const saturate = 1 + warmth / 200;
    const sepia = warmth > 0 ? warmth / 150 : 0;
    const hue = warmth < 0 ? warmth / 3 : 0;
    
    return {
      filter: `brightness(${brightness}) saturate(${saturate}) sepia(${sepia}) hue-rotate(${hue}deg)`,
      transition: 'filter 0.2s ease-out'
    };
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col lg:flex-row-reverse gap-8 items-stretch">
      {/* Simulation Screen */}
      <div className="flex-1 flex flex-col justify-between min-h-[300px] lg:min-h-[400px] relative rounded-xl overflow-hidden bg-black/80 border border-white/5 group select-none">
        {/* Render View */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Background out-of-focus background */}
          <img
            src={selected.imageUrl}
            alt="Render simulator scene preview"
            className="w-full h-full object-cover transition-all duration-300"
            style={{ 
              ...calculateStyle(),
              filter: `${calculateStyle().filter} blur(${calculateBlur()}px)`
            }}
          />
          {/* In-focus Foreground Overlay Simulation */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Floating status badges */}
        <div className="relative z-10 m-4 flex justify-between items-start">
          <span className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-on-surface flex items-center gap-1.5 shadow-md">
            <Camera className="w-3.5 h-3.5 text-industrial-orange animate-pulse" />
            V-RAY LENS: f/{aperture.toFixed(1)}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setActivePreset('window')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border cursor-pointer transition-all duration-300 ${
                activePreset === 'window'
                  ? 'bg-industrial-orange border-industrial-orange text-white font-bold'
                  : 'bg-black/80 border-white/10 text-on-surface-variant hover:text-white'
              }`}
            >
              Passive Window
            </button>
            <button
              onClick={() => setActivePreset('corridor')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border cursor-pointer transition-all duration-300 ${
                activePreset === 'corridor'
                  ? 'bg-industrial-orange border-industrial-orange text-white font-bold'
                  : 'bg-black/80 border-white/10 text-on-surface-variant hover:text-white'
              }`}
            >
              Corridor CGI
            </button>
          </div>
        </div>

        {/* Bottom photographic parameters display */}
        <div className="relative z-10 m-4 bg-black/85 backdrop-blur-md p-4 rounded-xl border border-white/15 shadow-2xl flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="font-mono text-[10px] text-industrial-orange uppercase tracking-widest block">ACTIVE SCENE</span>
            <span className="font-sans text-sm font-bold text-white block mt-0.5">{selected.name}</span>
            <span className="font-mono text-[10px] text-on-surface-variant line-clamp-1 mt-1">{selected.description}</span>
          </div>
          <div className="flex gap-4 font-mono text-xs">
            <div>
              <span className="text-[10px] text-on-surface-variant block">EXPOSURE</span>
              <span className="text-white font-bold">EV {(exposure / 10).toFixed(1)}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block">TEMP</span>
              <span className="text-white font-bold">{warmth > 0 ? `+${warmth}` : warmth} K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Simulator Control Panel */}
      <div className="w-full lg:w-80 flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-5 h-5 text-industrial-orange" />
            <span className="font-mono text-xs text-industrial-orange uppercase tracking-widest">
              V-Ray Physical Camera
            </span>
          </div>
          <h3 className="text-2xl font-black font-sans text-on-surface tracking-tight">
            Render Optics Simulator
          </h3>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Adjust real-time physical rendering attributes in the browser. Witness how camera lens values determine mood, atmospheric exposure, and spatial depth.
          </p>
        </div>

        {/* Sliders Block */}
        <div className="flex flex-col gap-5">
          {/* Exposure Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-on-surface font-semibold">Exposure Speed</span>
              <span className="text-industrial-orange font-bold">{(exposure / 10).toFixed(1)} EV</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={exposure}
              onChange={(e) => setExposure(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-industrial-orange"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
              <span>Low Light (Moody)</span>
              <span>Overexposed</span>
            </div>
          </div>

          {/* Color Temperature (Warmth) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-on-surface font-semibold">Atmospheric Kelvin</span>
              <span className="text-industrial-orange font-bold">{warmth > 0 ? `+${warmth}` : warmth} K</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={warmth}
              onChange={(e) => setWarmth(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-industrial-orange"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
              <span>Cold (4500K)</span>
              <span>Warm (8500K)</span>
            </div>
          </div>

          {/* Aperture (f-stop) Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold text-on-surface">Lens Aperture (Depth of Field)</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[1.4, 2.8, 5.6, 11].map((f) => (
                <button
                  key={f}
                  onClick={() => setAperture(f)}
                  className={`py-1.5 rounded font-mono text-xs border transition-all duration-300 cursor-pointer ${
                    aperture === f
                      ? 'bg-industrial-orange border-industrial-orange text-white font-bold shadow-md'
                      : 'bg-white/[0.03] border-white/5 text-on-surface-variant hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  f/{f}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
              <span>Shallow Focus</span>
              <span>Infinite Focus</span>
            </div>
          </div>
        </div>

        {/* Reset Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-1.5 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-on-surface text-xs font-mono py-2.5 rounded-xl transition-all duration-300 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Camera Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
