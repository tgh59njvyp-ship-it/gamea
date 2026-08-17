import React from 'react';
import { Move, RotateCw, Check, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface LayoutEditModalProps {
  checkoutPosition: [number, number, number];
  checkoutRotation: number;
  onMoveRegister: (dx: number, dz: number) => void;
  onRotateRegister: () => void;
  onResetPosition: () => void;
  onClose: () => void;
}

export const LayoutEditModal: React.FC<LayoutEditModalProps> = ({
  checkoutPosition,
  checkoutRotation,
  onMoveRegister,
  onRotateRegister,
  onResetPosition,
  onClose,
}) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 pointer-events-auto animate-slide-up">
      <div className="bg-slate-900/95 border border-slate-700/90 rounded-3xl shadow-2xl backdrop-blur-md p-4 text-white">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Move className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-100">レジカウンターの場所変更</div>
              <div className="text-[10px] text-slate-400">
                位置: ({checkoutPosition[0].toFixed(1)}, {checkoutPosition[2].toFixed(1)})
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playDoorChime();
              onClose();
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg"
          >
            <Check className="w-4 h-4" /> 完了
          </button>
        </div>

        {/* Repositioning Touch D-Pad */}
        <div className="flex flex-col items-center gap-2 my-2">
          {/* Up */}
          <button
            onClick={() => onMoveRegister(0, -0.5)}
            className="w-12 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-sky-600 rounded-xl flex items-center justify-center text-slate-200 transition-all active:scale-95"
            title="奥へ移動"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Left / Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onMoveRegister(-0.5, 0)}
              className="w-12 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-sky-600 rounded-xl flex items-center justify-center text-slate-200 transition-all active:scale-95"
              title="左へ移動"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Rotate Button */}
            <button
              onClick={onRotateRegister}
              className="w-12 h-10 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg"
              title="90度回転"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <button
              onClick={() => onMoveRegister(0.5, 0)}
              className="w-12 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-sky-600 rounded-xl flex items-center justify-center text-slate-200 transition-all active:scale-95"
              title="右へ移動"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Down */}
          <button
            onClick={() => onMoveRegister(0, 0.5)}
            className="w-12 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-sky-600 rounded-xl flex items-center justify-center text-slate-200 transition-all active:scale-95"
            title="手前へ移動"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Reset Option */}
        <div className="text-center mt-2">
          <button
            onClick={onResetPosition}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline"
          >
            初期位置に戻す
          </button>
        </div>
      </div>
    </div>
  );
};
