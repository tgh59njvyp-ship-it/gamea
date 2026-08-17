import React, { useState, useEffect, useRef } from 'react';
import { Gamepad as GamepadIcon, Move, Hand, RefreshCw, Smartphone } from 'lucide-react';

interface TouchControllerProps {
  onMove: (dir: { x: number; y: number }) => void;
  onRotateCamera: (delta: { x: number; y: number }) => void;
  onActionClick: () => void;
  onToggleCamera: () => void;
  isFirstPerson: boolean;
  gamepadConnected: boolean;
  gamepadName: string | null;
}

export const TouchController: React.FC<TouchControllerProps> = ({
  onMove,
  onRotateCamera,
  onActionClick,
  onToggleCamera,
  isFirstPerson,
  gamepadConnected,
  gamepadName,
}) => {
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickBaseRef = useRef<HTMLDivElement>(null);

  // Touch drag for camera rotation on right side of screen
  const touchRightPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setJoystickActive(true);
    updateJoystickPos(e.touches[0]);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!joystickActive) return;
    updateJoystickPos(e.touches[0]);
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const updateJoystickPos = (touch: React.Touch) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxRadius = 45;
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;

    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setJoystickPos({ x: dx, y: dy });

    // Normalized vector (-1 to +1)
    const normX = dx / maxRadius;
    const normY = dy / maxRadius;
    onMove({ x: normX, y: normY });
  };

  // Right side screen touch rotation look
  const handleRightTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX > window.innerWidth / 2) {
      touchRightPosRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleRightTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touchRightPosRef.current && touch.clientX > window.innerWidth / 3) {
      const dx = touch.clientX - touchRightPosRef.current.x;
      const dy = touch.clientY - touchRightPosRef.current.y;
      onRotateCamera({ x: dx * 0.005, y: dy * 0.005 });
      touchRightPosRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleRightTouchEnd = () => {
    touchRightPosRef.current = null;
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 overflow-hidden"
      onTouchStart={handleRightTouchStart}
      onTouchMove={handleRightTouchMove}
      onTouchEnd={handleRightTouchEnd}
    >
      {/* Top Controller Status Badge */}
      <div className="self-center pointer-events-auto flex items-center gap-2">
        {gamepadConnected ? (
          <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-2 animate-pulse">
            <GamepadIcon className="w-4 h-4 text-emerald-400" />
            <span>コントローラー/Joy-Con 接続完了 ({gamepadName || 'Nintendo Switch / Gamepad'})</span>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-700/60 text-slate-300 px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-md flex items-center gap-1.5 md:hidden">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span>スマホ・タッチ操作モード (画面スライドでカメラ回転)</span>
          </div>
        )}
      </div>

      {/* Bottom Controls Area */}
      <div className="flex items-end justify-between w-full pointer-events-none">
        {/* Left Side: Virtual Joystick (Mobile & Touch Mode) */}
        {isFirstPerson && (
          <div className="pointer-events-auto relative mb-2 ml-2">
            <div
              ref={joystickBaseRef}
              onTouchStart={handleJoystickTouchStart}
              onTouchMove={handleJoystickTouchMove}
              onTouchEnd={handleJoystickTouchEnd}
              className="w-28 h-28 rounded-full bg-slate-900/70 border-2 border-slate-600/80 backdrop-blur-md flex items-center justify-center relative touch-none shadow-2xl"
            >
              {/* Center Stick Handle */}
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 border-2 border-white shadow-lg transition-transform duration-75 flex items-center justify-center text-white"
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}
              >
                <Move className="w-5 h-5 text-white" />
              </div>

              <div className="absolute top-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                WASD / 移動
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Quick On-Screen Action Buttons */}
        <div className="pointer-events-auto flex flex-col gap-2.5 mb-2 mr-2 items-end">
          {/* Action / Inspect Button */}
          <button
            id="btn-touch-action"
            onClick={onActionClick}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-2xl shadow-emerald-500/30 border-2 border-emerald-300/60 flex flex-col items-center justify-center gap-1 transition-all active:scale-90"
          >
            <Hand className="w-6 h-6 text-white" />
            <span className="text-[10px]">調べる・操作</span>
          </button>

          {/* Toggle View Mode Button */}
          <button
            id="btn-touch-camera"
            onClick={onToggleCamera}
            className="w-12 h-12 rounded-xl bg-slate-800/90 text-sky-400 font-bold text-xs shadow-xl border border-slate-700 flex items-center justify-center transition-all active:scale-90 backdrop-blur-md"
            title="視点切替"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
