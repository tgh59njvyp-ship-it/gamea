import React from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import {
  Store,
  DollarSign,
  Clock,
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
  onEndDay,
  isMuted,
}) => {
  const activeCustomersAtRegister = gameState.customers.filter(
    (c) => c.state === 'WAITING_FOR_REGISTER' || c.state === 'AT_REGISTER'
  );

  return (
    <div className="absolute inset-0 p-2 md:p-4 pointer-events-none flex flex-col justify-between select-none z-10">
      {/* Top Controls Area */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: Minimal Camera, Sound & Market Name */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              id="btn-toggle-camera"
              onClick={() => {
                soundManager.playDoorChime();
                onToggleCamera();
              }}
              className="p-2 md:p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
              title="カメラ視点切替"
            >
              <Video className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">
                {gameState.cameraMode === 'first_person' ? '1人称' : '俯瞰'}
              </span>
            </button>

            <button
              id="btn-toggle-sound"
              onClick={onToggleSound}
              className="p-2 md:p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition-all active:scale-95"
              title="効果音オン/オフ"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>

          {/* Store Name Badge */}
          <div className="bg-slate-900/80 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md backdrop-blur-md flex items-center gap-1.5 max-w-[180px] md:max-w-none truncate">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: gameState.storeSignColor || '#0284c7' }}
            />
            <span className="truncate">{gameState.storeName || 'MY MART'}</span>
          </div>
        </div>

        {/* Top-Right: Money, Level & Time Compact Widget */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 text-white p-2.5 md:p-3 px-3.5 md:px-4 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md flex flex-col items-end gap-1 min-w-[180px] md:min-w-[210px]">
            {/* Top row: Shop Level & Time */}
            <div className="flex items-center justify-between w-full gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-sky-400" />
                <span className="bg-sky-500/20 text-sky-300 text-[10px] md:text-[11px] font-extrabold px-1.5 py-0.5 rounded border border-sky-500/30">
                  Lv.{gameState.storeLevel}
                </span>
              </div>
              <div className="flex items-center gap-1 text-indigo-300 font-bold text-xs">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Day {gameState.day} {gameState.timeOfDay}</span>
              </div>
            </div>

            {/* EXP Progress Bar */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (gameState.exp / gameState.nextLevelExp) * 100)}%`,
                }}
              />
            </div>

            {/* Bottom row: Money Highlight in USD ($) */}
            <div className="flex items-center justify-between w-full mt-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">所持金</span>
              <div className="flex items-center gap-0.5 text-emerald-400 font-black text-lg md:text-xl tracking-tight">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                <span>{gameState.cash.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Store Open / Closed Status & End Day Action */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-toggle-open-sign"
              onClick={onToggleStoreOpen}
              className={`px-3 py-1.5 rounded-xl font-black text-xs border shadow-xl flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 ${
                gameState.isStoreOpen
                  ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-400 hover:bg-emerald-900/90'
                  : 'bg-rose-950/90 border-rose-500/60 text-rose-400 hover:bg-rose-900/90'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${gameState.isStoreOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
              <span>{gameState.isStoreOpen ? 'OPEN (営業中)' : 'CLOSED (開店準備中)'}</span>
            </button>

            {!gameState.isStoreOpen && gameState.customers.length === 0 && (
              <button
                id="btn-end-day-summary"
                onClick={onEndDay}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-xl border border-amber-300 flex items-center gap-1.5 animate-bounce backdrop-blur-md"
              >
                <span>🌙 日次決算</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Dock: Smartphone Touch Optimized Controls */}
      <div className="flex flex-col gap-2 w-full">
        {/* Held Box Banner */}
        {gameState.heldBoxId && (
          <div className="self-center pointer-events-auto flex items-center gap-3 bg-amber-950/90 text-amber-200 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md animate-pulse">
            <PackageCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <div className="font-bold">段ボール箱を所持中</div>
              <div className="text-[10px] text-amber-300/80">棚をタップして補充</div>
            </div>
            {onDropBox && (
              <button
                id="btn-drop-box"
                onClick={onDropBox}
                className="ml-2 bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-bold px-2.5 py-1 rounded-xl border border-amber-600/50"
              >
                <PackageX className="w-3.5 h-3.5 inline mr-0.5" />
                置く
              </button>
            )}
          </div>
        )}

        {/* Action Dock */}
        <div className="flex items-center justify-center gap-2 pointer-events-auto w-full max-w-xl mx-auto px-1">
          {/* Move Register / Layout Button */}
          <button
            id="btn-layout-edit"
            onClick={onToggleLayoutEdit}
            className={`flex-1 py-2.5 px-2 rounded-2xl font-bold text-xs shadow-xl transition-all active:scale-95 border flex flex-col items-center justify-center gap-1 backdrop-blur-md ${
              gameState.isEditLayoutMode
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Move className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] sm:text-xs">レジ場所変更</span>
          </button>

          {/* Laptop Order PC Button */}
          <button
            id="btn-quick-laptop"
            onClick={() => {
              soundManager.playDoorChime();
              onOpenLaptop();
            }}
            className="flex-1 py-2.5 px-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-2xl border border-sky-400 shadow-xl transition-all active:scale-95 flex flex-col items-center justify-center gap-1 backdrop-blur-md"
          >
            <Monitor className="w-4 h-4 text-sky-200" />
            <span className="text-[10px] sm:text-xs">発注・経営PC</span>
          </button>

          {/* Checkout Register Button */}
          <button
            id="btn-quick-register"
            onClick={() => {
              soundManager.playDoorChime();
              onOpenRegister();
            }}
            className={`flex-1 py-2.5 px-2 rounded-2xl font-bold text-xs shadow-xl transition-all active:scale-95 border flex flex-col items-center justify-center gap-1 backdrop-blur-md ${
              activeCustomersAtRegister.length > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-300 animate-bounce'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] sm:text-xs">
              レジ会計 {activeCustomersAtRegister.length > 0 && `(${activeCustomersAtRegister.length}人)`}
            </span>
          </button>

          {/* Storage Room Status Badge ($800) */}
          <button
            id="btn-quick-storage"
            onClick={() => {
              soundManager.playDoorChime();
              onOpenLaptop();
            }}
            className={`flex-1 py-2.5 px-2 rounded-2xl font-bold text-xs shadow-xl transition-all active:scale-95 border flex flex-col items-center justify-center gap-1 backdrop-blur-md ${
              gameState.unlockedStorage
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-900/90 text-amber-300 border-amber-500/40'
            }`}
            title="隣の倉庫 (800ドル解禁)"
          >
            {gameState.unlockedStorage ? (
              <>
                <DoorOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] sm:text-xs">倉庫使用可</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] sm:text-xs">倉庫 $800</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

