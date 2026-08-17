import React from 'react';
import { RefreshCw, AlertTriangle, X } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ResetConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  onConfirm,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-14 h-14 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-2xl flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">ゲームデータの初期化</h2>
            <p className="text-xs text-rose-300 mt-1 font-semibold">
              ※ この操作を取り消すことはできません
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 text-xs text-slate-300 space-y-2">
          <p>以下のデータが全てリセットされ、初日（Day 1）から再スタートします：</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
            <li>所持金 ($500.00) および 売上履歴</li>
            <li>店舗名・看板カラーの再設定</li>
            <li>配置した棚・在庫箱・解禁ライセンス</li>
            <li>隣接倉庫の解禁ステータス</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              soundManager.playDoorChime();
              onConfirm();
            }}
            className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs rounded-xl border border-rose-400 shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>初期化してリセット</span>
          </button>
        </div>
      </div>
    </div>
  );
};
