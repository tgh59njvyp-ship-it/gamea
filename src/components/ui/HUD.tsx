import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import {
  Menu,
  X,
  Monitor,
  CreditCard,
  DoorOpen,
  DoorClosed,
  Video,
  Volume2,
  VolumeX,
  RotateCcw,
  Move,
  PackageCheck,
  PackageX,
  Sun,
  Droplets,
  CalendarCheck,
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const activeCustomersAtRegister = gameState.customers.filter(
    (c) => c.state === 'WAITING_FOR_REGISTER' || c.state === 'AT_REGISTER'
  );

  // Objective calculation based on store stats
  const checkoutGoal = 25;
  const currentCheckouts = Math.min(
    checkoutGoal,
    gameState.todayStats.customersServed
  );

  return (
    <div className="absolute inset-0 p-3 md:p-5 pointer-events-none flex flex-col justify-between select-none z-10 font-sans">
      {/* Top Header Row (Authentic Supermarket Simulator + Menu Button) */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: OBJECTIVE Box */}
        <div className="flex flex-col gap-2.5 pointer-events-auto">
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
        </div>

        {/* Top-Center: Sleek Authentic Menu Button */}
        <div className="pointer-events-auto">
          <button
            id="btn-open-game-menu"
            onClick={() => {
              soundManager.playDoorChime();
              setIsMenuOpen(true);
            }}
            className="bg-black/90 hover:bg-slate-900 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-xl border border-white/20 shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all"
          >
            <Menu className="w-4 h-4 text-amber-400" />
            <span>メニュー</span>
          </button>
        </div>

        {/* Top-Right: Store Level, Cash & Clock (Authentic Replica) */}
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

      {/* Bottom Row: Controls Box (Left), Held Box Banner (Center), Watermark (Right) */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        {/* Bottom-Left Controls Guide Box (Supermarket Simulator Replica) */}
        <div className="bg-black/90 text-white p-3 md:p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md w-44 md:w-52 text-xs space-y-1.5 font-bold">
          <div className="flex items-center justify-between text-slate-200">
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px]">
              G
            </span>
            <span className="text-slate-300">Drop</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px]">
              R
            </span>
            <span className="text-slate-300">Throw</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px]">
              C
            </span>
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

        {/* Bottom-Center: Held Box Indicator (Only when holding a box) */}
        {gameState.heldBoxId && (
          <div className="flex items-center gap-2.5 bg-amber-950/90 text-amber-200 border border-amber-500/40 px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md animate-pulse">
            <PackageCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold">段ボール箱を所持中</span>
            {onDropBox && (
              <button
                onClick={onDropBox}
                className="bg-amber-800 hover:bg-amber-700 text-white text-xs px-2 py-0.5 rounded-lg border border-amber-600/50 flex items-center gap-1"
              >
                <PackageX className="w-3.5 h-3.5" />
                <span>置く</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom-Right Watermark */}
        <div className="text-slate-400 font-mono text-[11px] opacity-70">
          V0.9.2 (123)
        </div>
      </div>

      {/* Full Game Pause Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-white animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white tracking-wide">
                  ゲームメニュー
                </h2>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Options Grid */}
            <div className="grid grid-cols-1 gap-2.5 mb-6">
              {/* Laptop Computer */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  soundManager.playDoorChime();
                  onOpenLaptop();
                }}
                className="w-full py-3 px-4 bg-sky-950/80 hover:bg-sky-900 text-sky-200 font-bold text-xs rounded-2xl border border-sky-500/40 flex items-center justify-between transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span>発注・経営PCを開く</span>
                </div>
                <span className="text-[10px] text-sky-400 bg-sky-900/80 px-2 py-0.5 rounded-full">
                  商品の発注・ライセンス
                </span>
              </button>

              {/* Checkout Register */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  soundManager.playDoorChime();
                  onOpenRegister();
                }}
                className={`w-full py-3 px-4 font-bold text-xs rounded-2xl border flex items-center justify-between transition-all active:scale-98 ${
                  activeCustomersAtRegister.length > 0
                    ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/60 animate-pulse'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>レジ会計画面を開く</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                  {activeCustomersAtRegister.length}人待ち
                </span>
              </button>

              {/* Store Open / Closed Toggle */}
              <button
                onClick={() => {
                  soundManager.playDoorChime();
                  onToggleStoreOpen();
                }}
                className={`w-full py-3 px-4 font-bold text-xs rounded-2xl border flex items-center justify-between transition-all active:scale-98 ${
                  gameState.isStoreOpen
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                    : 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {gameState.isStoreOpen ? (
                    <DoorOpen className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <DoorClosed className="w-4 h-4 text-rose-400" />
                  )}
                  <span>店舗営業ステータス</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    gameState.isStoreOpen
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {gameState.isStoreOpen ? 'OPEN (営業中)' : 'CLOSED (準備中)'}
                </span>
              </button>

              {/* End Day Summary (Only when store closed and no customers) */}
              {!gameState.isStoreOpen && gameState.customers.length === 0 && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEndDay();
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg border border-amber-300 flex items-center justify-between transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-4 h-4 text-slate-950" />
                    <span>日次決算（1日を終了して集計）</span>
                  </div>
                  <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                    Day {gameState.day} 終了
                  </span>
                </button>
              )}

              {/* Layout Move */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onToggleLayoutEdit();
                }}
                className={`w-full py-3 px-4 font-bold text-xs rounded-2xl border flex items-center justify-between transition-all active:scale-98 ${
                  gameState.isEditLayoutMode
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Move className="w-4 h-4 text-amber-400" />
                  <span>レジの位置・レイアウト変更</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {gameState.isEditLayoutMode ? '編集中' : '移動モード'}
                </span>
              </button>

              {/* Camera Perspective Toggle */}
              <button
                onClick={() => {
                  soundManager.playDoorChime();
                  onToggleCamera();
                }}
                className="w-full py-3 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-between transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-sky-400" />
                  <span>カメラ視点切替</span>
                </div>
                <span className="text-[10px] text-sky-400 bg-sky-950 px-2 py-0.5 rounded-full">
                  {gameState.cameraMode === 'first_person'
                    ? '1人称視点'
                    : '俯瞰視点'}
                </span>
              </button>

              {/* Sound Mute Toggle */}
              <button
                onClick={onToggleSound}
                className="w-full py-3 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-between transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>効果音設定</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {isMuted ? 'ミュート中' : 'オン'}
                </span>
              </button>

              {/* Reset Game Data */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenResetModal();
                }}
                className="w-full py-3 px-4 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 font-bold text-xs rounded-2xl border border-rose-600/40 flex items-center justify-between transition-all active:scale-98 mt-2"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>ゲームデータをリセット</span>
                </div>
                <span className="text-[10px] text-rose-400 bg-rose-950 px-2 py-0.5 rounded-full">
                  初期化
                </span>
              </button>
            </div>

            {/* Close / Resume Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-2xl border border-slate-700 transition-all active:scale-98 text-center"
            >
              ゲームに戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



