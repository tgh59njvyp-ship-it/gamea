import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import {
  Video,
  Volume2,
  VolumeX,
  Monitor,
  CreditCard,
  PackageCheck,
  PackageX,
  Move,
  Lock,
  DoorOpen,
  Eye,
  EyeOff,
  RotateCcw,
  Sun,
  Droplets,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface HUDProps {
  gameState: GameState;
  onToggleCamera: () => void;
  onOpenRegister: () => void;
  onOpenLaptop: () => void;
  onDropBox?: () => void;
  onToggleSound: () => void;
  onToggleStoreOpen: () => void;
  onToggleLayoutEdit: () => void;
  onOpenResetModal: () => void;
  onEndDay: () => void;
  isMuted: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  onToggleCamera,
  onOpenRegister,
  onOpenLaptop,
  onDropBox,
  onToggleSound,
  onToggleStoreOpen,
  onToggleLayoutEdit,
  onOpenResetModal,
  onEndDay,
  isMuted,
}) => {
  const [isUiHidden, setIsUiHidden] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  const activeCustomersAtRegister = gameState.customers.filter(
    (c) => c.state === 'WAITING_FOR_REGISTER' || c.state === 'AT_REGISTER'
  );

  // Objective calculation based on store stats
  const checkoutGoal = 25;
  const currentCheckouts = Math.min(checkoutGoal, gameState.todayStats.customersServed);

  // If entire UI is hidden by user request
  if (isUiHidden) {
    return (
      <div className="absolute top-3 left-3 z-30 pointer-events-auto select-none">
        <button
          id="btn-toggle-ui-show"
          onClick={() => {
            soundManager.playDoorChime();
            setIsUiHidden(false);
          }}
          className="bg-black/90 hover:bg-black text-white px-3.5 py-2 rounded-xl border border-white/20 shadow-2xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 text-xs font-bold"
          title="UIを再表示"
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span>UI表示</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-3 md:p-5 pointer-events-none flex flex-col justify-between select-none z-10 transition-all duration-300 font-sans">
      {/* Top Header Row */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: OBJECTIVE Box & Small Utility Bar */}
        <div className="flex flex-col gap-2.5 pointer-events-auto">
          {/* OBJECTIVE Box (Supermarket Simulator Exact Style) */}
          <div className="bg-black/90 text-white rounded-xl border border-white/10 p-3.5 shadow-2xl backdrop-blur-md w-52 md:w-60">
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              OBJECTIVE
            </div>
            <div className="text-white font-bold text-sm leading-tight">
              Perform checkouts
            </div>
            <div className="text-right text-white font-black text-base mt-2 tracking-wide">
              {currentCheckouts}/{checkoutGoal}
            </div>
          </div>

          {/* Minimal Quick Action Utilities */}
          <div className="flex items-center gap-1.5 bg-black/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md w-fit">
            {/* Camera View */}
            <button
              id="btn-toggle-camera"
              onClick={() => {
                soundManager.playDoorChime();
                onToggleCamera();
              }}
              className="p-1.5 hover:bg-white/10 text-slate-200 rounded-lg transition-all active:scale-95"
              title="カメラ視点"
            >
              <Video className="w-4 h-4 text-sky-400" />
            </button>

            {/* Mute */}
            <button
              id="btn-toggle-sound"
              onClick={onToggleSound}
              className="p-1.5 hover:bg-white/10 text-slate-200 rounded-lg transition-all active:scale-95"
              title="消音"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Store Open/Closed Toggle */}
            <button
              id="btn-toggle-open-sign"
              onClick={onToggleStoreOpen}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all border ${
                gameState.isStoreOpen
                  ? 'bg-emerald-950 border-emerald-500/60 text-emerald-400'
                  : 'bg-rose-950 border-rose-500/60 text-rose-400'
              }`}
            >
              {gameState.isStoreOpen ? 'OPEN' : 'CLOSED'}
            </button>

            {/* End Day */}
            {!gameState.isStoreOpen && gameState.customers.length === 0 && (
              <button
                id="btn-end-day-summary"
                onClick={onEndDay}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg animate-bounce"
              >
                日次決算
              </button>
            )}

            {/* Hide UI */}
            <button
              id="btn-toggle-ui-hide"
              onClick={() => setIsUiHidden(true)}
              className="p-1.5 hover:bg-white/10 text-slate-300 rounded-lg"
              title="UI非表示"
            >
              <EyeOff className="w-4 h-4 text-amber-400" />
            </button>

            {/* Reset */}
            <button
              id="btn-open-reset-modal"
              onClick={onOpenResetModal}
              className="p-1.5 hover:bg-white/10 text-rose-400 rounded-lg"
              title="リセット"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top-Right: Level Badge, Cash, Time & Sun/Drop Icon */}
        <div className="flex flex-col items-end gap-1.5 pointer-events-auto">
          {/* Level Pill */}
          <div className="bg-black/90 text-white font-extrabold text-xs px-3 py-1 rounded-lg border border-white/10 shadow-lg">
            Store Level {gameState.storeLevel}
          </div>

          {/* Large Cash Display */}
          <div className="text-white font-black text-2xl md:text-3xl tracking-tight drop-shadow-md my-0.5">
            ${gameState.cash.toFixed(2)}
          </div>

          {/* Clock & Status Icon */}
          <div className="flex items-center gap-2 text-white font-bold text-xs md:text-sm bg-black/80 px-2.5 py-1 rounded-lg border border-white/10">
            {gameState.isStoreOpen ? (
              <Droplets className="w-4 h-4 text-sky-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span>{gameState.timeOfDay}</span>
          </div>
        </div>
      </div>

      {/* Middle/Bottom Area: Controls Panel (Bottom-Left) & Action Dock (Center-Bottom) */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        {/* Bottom-Left Controls Guide Box (Supermarket Simulator Replica) */}
        <div className="bg-black/90 text-white p-3 md:p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md w-44 md:w-52 text-xs space-y-1.5 font-bold">
          <div className="flex items-center justify-between text-slate-200">
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px]">G</span>
            <span className="text-slate-300">Drop</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px]">R</span>
            <span className="text-slate-300">Throw</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px]">C</span>
            <span className="text-slate-300">Close</span>
          </div>
          <div className="flex items-center justify-between text-slate-200 pt-1 border-t border-white/10">
            <span className="text-slate-400 text-[10px]">Left Click</span>
            <span className="text-slate-200">Place</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span className="text-slate-400 text-[10px]">Right Click</span>
            <span className="text-slate-200">Take</span>
          </div>
        </div>

        {/* Bottom-Center Quick Dock */}
        <div className="flex flex-col items-center gap-1.5 max-w-md w-full mx-auto">
          {/* Held Box Notice */}
          {gameState.heldBoxId && (
            <div className="flex items-center gap-2.5 bg-amber-950/90 text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md animate-pulse">
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">箱を所持中 (棚をタップで充填)</span>
              {onDropBox && (
                <button
                  onClick={onDropBox}
                  className="bg-amber-800 hover:bg-amber-700 text-white text-xs px-2 py-0.5 rounded-lg border border-amber-600/50"
                >
                  置く
                </button>
              )}
            </div>
          )}

          {/* Quick Dock Buttons */}
          <div className="flex items-center gap-2 bg-black/90 p-1.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
            <button
              id="btn-quick-laptop"
              onClick={() => {
                soundManager.playDoorChime();
                onOpenLaptop();
              }}
              className="py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>発注PC</span>
            </button>

            <button
              id="btn-quick-register"
              onClick={() => {
                soundManager.playDoorChime();
                onOpenRegister();
              }}
              className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                activeCustomersAtRegister.length > 0
                  ? 'bg-emerald-500 text-slate-950 animate-bounce'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>レジ会計 ({activeCustomersAtRegister.length})</span>
            </button>

            <button
              id="btn-layout-edit"
              onClick={onToggleLayoutEdit}
              className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                gameState.isEditLayoutMode
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>レジ移動</span>
            </button>
          </div>
        </div>

        {/* Bottom-Right Watermark */}
        <div className="text-slate-400 font-mono text-[11px] opacity-70">
          V0.9.2 (123)
        </div>
      </div>
    </div>
  );
};


