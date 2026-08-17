import React from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import {
  Store,
  DollarSign,
  Star,
  Clock,
  Video,
  Volume2,
  VolumeX,
  ShoppingBag,
  Monitor,
  CreditCard,
  PackageCheck,
  PackageX,
} from 'lucide-react';

interface HUDProps {
  gameState: GameState;
  onToggleCamera: () => void;
  onOpenRegister: () => void;
  onOpenLaptop: () => void;
  onDropBox?: () => void;
  onToggleSound: () => void;
  onToggleStoreOpen: () => void;
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
  onEndDay,
  isMuted,
}) => {
  const activeCustomersAtRegister = gameState.customers.filter(
    (c) => c.state === 'WAITING_FOR_REGISTER' || c.state === 'AT_REGISTER'
  );

  return (
    <div className="absolute top-0 left-0 right-0 p-2 md:p-4 pointer-events-none flex flex-col gap-2 md:gap-3 select-none z-10">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3 bg-slate-900/90 text-white p-2.5 md:p-3 px-3 md:px-5 rounded-2xl border border-slate-700/60 shadow-2xl backdrop-blur-md pointer-events-auto">
        {/* Store Title & Level */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Store className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="font-bold text-xs md:text-base text-slate-100">{gameState.storeName}</span>
              <span className="bg-sky-500/20 text-sky-400 text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-md border border-sky-500/30">
                Lv.{gameState.storeLevel}
              </span>
            </div>
            {/* EXP Bar */}
            <div className="w-20 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5 md:mt-1 border border-slate-700">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (gameState.exp / gameState.nextLevelExp) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Financial Metrics & Open/Close Toggle */}
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
          {/* Store Open / Closed Door Sign Toggle */}
          <button
            id="btn-toggle-open-sign"
            onClick={onToggleStoreOpen}
            className={`px-3 py-1.5 rounded-xl font-black text-xs border shadow-lg flex items-center gap-1.5 transition-all active:scale-95 ${
              gameState.isStoreOpen
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 border-rose-500/50 text-rose-400 hover:bg-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${gameState.isStoreOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
            <span>{gameState.isStoreOpen ? 'OPEN (営業中)' : 'CLOSED (開店準備中)'}</span>
          </button>

          {/* End Day Button (Appears when CLOSED and no remaining customers) */}
          {!gameState.isStoreOpen && gameState.customers.length === 0 && (
            <button
              id="btn-end-day-summary"
              onClick={onEndDay}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 animate-bounce"
            >
              <span>🌙 本日の営業を終了 (日次決算)</span>
            </button>
          )}

          {/* Cash Balance */}
          <div className="flex items-center gap-1.5 md:gap-2.5 bg-slate-800/80 px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl border border-slate-700/80">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div>
              <div className="text-[9px] md:text-[10px] text-slate-400 font-medium">所持金</div>
              <div className="text-emerald-400 font-extrabold text-sm md:text-lg tracking-tight">
                ¥{gameState.cash.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Store Reputation */}
          <div className="flex items-center gap-1.5 md:gap-2.5 bg-slate-800/80 px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl border border-slate-700/80">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-[9px] md:text-[10px] text-slate-400 font-medium">店舗評価</div>
              <div className="text-amber-400 font-bold text-xs md:text-base">
                {gameState.reputation} <span className="text-[9px] md:text-xs text-slate-400">/ 100</span>
              </div>
            </div>
          </div>

          {/* Day & Time */}
          <div className="hidden sm:flex items-center gap-1.5 md:gap-2.5 bg-slate-800/80 px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl border border-slate-700/80">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div>
              <div className="text-[9px] md:text-[10px] text-slate-400 font-medium">店舗営業日</div>
              <div className="text-indigo-300 font-bold text-xs md:text-sm">
                Day {gameState.day} ({gameState.timeOfDay})
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Sound */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Camera View Mode Toggle */}
          <button
            id="btn-toggle-camera"
            onClick={() => {
              soundManager.playDoorChime();
              onToggleCamera();
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl border border-slate-700 transition-all active:scale-95"
            title="カメラ視点切替"
          >
            <Video className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-400" />
            <span className="hidden sm:inline">{gameState.cameraMode === 'first_person' ? '1人称 (操作)' : '俯瞰 (店舗)'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className="p-1.5 md:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all active:scale-95"
            title="効果音オン/オフ"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Bar: Quick Navigation & Notifications */}
      <div className="flex items-end justify-between gap-3">
        {/* Held Item Status Bar */}
        <div className="pointer-events-auto">
          {gameState.heldBoxId ? (
            <div className="flex items-center gap-3 bg-amber-950/90 text-amber-200 border border-amber-500/40 px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-md animate-pulse">
              <PackageCheck className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold">段ボール箱を抱えています</div>
                <div className="text-[11px] text-amber-300/80">棚をクリックして商品を補給</div>
              </div>
              {onDropBox && (
                <button
                  id="btn-drop-box"
                  onClick={onDropBox}
                  className="ml-2 bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-600/50"
                >
                  <PackageX className="w-3.5 h-3.5 inline mr-1" />
                  置く
                </button>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/80 text-slate-300 border border-slate-800 px-4 py-2 rounded-xl text-xs backdrop-blur-md">
              💡 マウスドラッグで視点変更 | WASDで移動 | クリックで棚やPCを操作
            </div>
          )}
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Register Waiting Alert Button */}
          <button
            id="btn-quick-register"
            onClick={() => {
              soundManager.playDoorChime();
              onOpenRegister();
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xl transition-all active:scale-95 border ${
              activeCustomersAtRegister.length > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 animate-bounce'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>レジ会計</span>
            {activeCustomersAtRegister.length > 0 && (
              <span className="bg-slate-950 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {activeCustomersAtRegister.length}人待ち
              </span>
            )}
          </button>

          {/* Store Computer Shortcut */}
          <button
            id="btn-quick-laptop"
            onClick={() => {
              soundManager.playDoorChime();
              onOpenLaptop();
            }}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-sky-400 shadow-xl transition-all active:scale-95"
          >
            <Monitor className="w-4 h-4" />
            <span>発注・経営PC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
