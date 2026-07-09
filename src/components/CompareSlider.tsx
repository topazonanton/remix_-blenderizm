import React, { useState, useRef, useEffect } from 'react';
import { Eye, MoveHorizontal, RefreshCw } from 'lucide-react';

interface CompareSliderProps {
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
  title?: string;
  subtitle?: string;
  isBlenderViewport?: boolean;
}

export default function CompareSlider({
  leftImage,
  rightImage,
  leftLabel = 'TEXTURED RENDER',
  rightLabel = 'CLAY MESH / WIREFRAME',
  title = 'Topology Visualizer',
  subtitle = 'Drag the slider to inspect clean geometry and edge flow',
  isBlenderViewport = false
}: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end">
        <div>
          <span className="font-mono text-xs text-industrial-orange uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Interactive Wireframe Inspector
          </span>
          <h3 className="text-xl font-bold font-sans text-on-surface mt-1">{title}</h3>
          <p className="text-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <button
          onClick={() => setSliderPosition(50)}
          className="p-1.5 rounded-md hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          title="Reset position"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative h-72 md:h-96 w-full rounded-xl overflow-hidden border border-white/10 select-none shadow-2xl bg-surface-dark cursor-ew-resize"
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        {/* Left Side (Under Image - Textured Render) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={leftImage}
            alt={leftLabel}
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-industrial-orange border border-white/5 uppercase tracking-wider">
            {leftLabel}
          </div>
        </div>

        {/* Right Side (Over Image - Clay Mesh / Blender Solid View) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
        >
          {/* Grid pattern background overlay */}
          {isBlenderViewport && (
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] bg-center z-10" />
          )}

          {/* Red X Axis & Green Y Axis */}
          {isBlenderViewport && (
            <>
              <div className="absolute top-[65%] left-0 right-0 h-[1px] bg-red-500/20 pointer-events-none z-10" />
              <div className="absolute top-0 bottom-0 left-[48%] w-[1px] bg-green-500/20 pointer-events-none z-10" />
            </>
          )}

          <img
            src={rightImage}
            alt={rightLabel}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ 
              filter: isBlenderViewport 
                ? 'grayscale(100%) brightness(1.25) contrast(1.3) sepia(25%) hue-rotate(185deg) saturate(160%)'
                : rightImage === leftImage ? 'grayscale(100%) contrast(150%) brightness(40%) invert(5%)' : 'none'
            }}
          />

          {/* Orange active selection outline */}
          {isBlenderViewport && (
            <div className="absolute inset-0 border border-[#ff9800]/50 pointer-events-none shadow-[inset_0_0_25px_rgba(255,152,0,0.18)] z-10 rounded-xl" />
          )}

          {/* Blender Viewport UI Overlays */}
          {isBlenderViewport ? (
            <>
              {/* Top Left Menu */}
              <div className="absolute top-4 left-4 flex flex-col font-mono text-[10px] text-white/50 gap-0.5 select-none pointer-events-none z-10 bg-black/40 px-2 py-1.5 rounded border border-white/5 backdrop-blur-sm">
                <span className="text-white font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  User Perspective
                </span>
                <span>(1) Collection | Tactical_Drone</span>
              </div>

              {/* Top Right Gizmo & Shading Modes */}
              <div className="absolute top-4 right-4 flex items-center gap-2.5 select-none pointer-events-none z-10">
                {/* Viewport shading buttons */}
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-1 rounded-md border border-white/10 shadow-lg">
                  {/* Wireframe */}
                  <div className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full border border-white/30" />
                  </div>
                  {/* Solid (Active) */}
                  <div className="w-3.5 h-3.5 rounded-full bg-white/10 border border-[#ff9800] flex items-center justify-center shadow-[0_0_4px_rgba(255,152,0,0.5)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff9800]" />
                  </div>
                  {/* Material */}
                  <div className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center" />
                  {/* Rendered */}
                  <div className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center" />
                </div>

                {/* Shading Mode label */}
                <div className="bg-[#ff9800] text-black font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                  {rightLabel}
                </div>
              </div>

              {/* Bottom Left Navigation Overlay */}
              <div className="absolute bottom-4 left-4 flex gap-2.5 font-mono text-[9px] text-white/40 bg-black/50 backdrop-blur-sm px-2 py-1.5 rounded border border-white/15 select-none pointer-events-none z-10 shadow-lg">
                <span className="hover:text-white transition-colors">View</span>
                <span className="hover:text-white transition-colors">Select</span>
                <span className="hover:text-white transition-colors">Add</span>
                <span className="hover:text-white transition-colors">Object</span>
              </div>

              {/* Bottom Right Statistics */}
              <div className="absolute bottom-4 right-4 flex flex-col font-mono text-[9px] text-white/50 text-right select-none pointer-events-none z-10 bg-black/50 backdrop-blur-sm px-2 py-1.5 rounded border border-white/15 shadow-lg gap-0.5">
                <div>Verts: 175,200 | Faces: 168,400</div>
                <div>Tris: 340,000 | Objects: 1/1</div>
              </div>
            </>
          ) : (
            <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-printer-green border border-white/5 uppercase tracking-wider">
              {rightLabel}
            </div>
          )}
        </div>

        {/* Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute w-8 h-8 rounded-full bg-white text-black border border-white/10 shadow-2xl flex items-center justify-center z-30 transform -translate-x-1/2">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
