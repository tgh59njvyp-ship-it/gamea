import React, { useState } from 'react';
import { Store, Sparkles, ArrowRight, Palette, DollarSign } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface OnboardingModalProps {
  initialStoreName: string;
  initialSignColor: string;
  onComplete: (storeName: string, signColor: string) => void;
}

const COLOR_OPTIONS = [
  { name: 'オーシャンブルー', hex: '#0284c7', labelColor: 'bg-sky-600' },
  { name: 'エメラルドグリーン', hex: '#059669', labelColor: 'bg-emerald-600' },
  { name: 'アンバーゴールド', hex: '#d97706', labelColor: 'bg-amber-600' },
  { name: 'ローズレッド', hex: '#e11d48', labelColor: 'bg-rose-600' },
  { name: 'ディープパープル', hex: '#7c3aed', labelColor: 'bg-purple-600' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialStoreName,
  initialSignColor,
  onComplete,
}) => {
  const [storeName, setStoreName] = useState(initialStoreName || 'マルエツ スーパーマート');
  const [selectedColor, setSelectedColor] = useState(initialSignColor || '#0284c7');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    soundManager.playDoorChime();
    onComplete(storeName.trim(), selectedColor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 text-white">
        {/* Header Visual Badge */}
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-xl shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Store className="w-8 h-8 text-sky-400 animate-bounce" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-extrabold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 新規店舗オープン準備
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              スーパーマーケット開店
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              あなたのスーパーマーケットの名前と看板デザインを決定しましょう！
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Market Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              店舗名 (マーケット名) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="例: MY SUPERMARKET"
                maxLength={20}
                required
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-3.5 text-slate-100 font-bold text-base md:text-lg placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Store Sign Theme Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-400" /> 看板テーマカラー
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  className={`h-11 rounded-xl flex items-center justify-center border-2 transition-all ${
                    selectedColor === c.hex
                      ? 'border-white scale-105 shadow-lg'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.hex && (
                    <div className="w-3 h-3 rounded-full bg-white shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Setup Info Box */}
          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60 flex items-center gap-3 text-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">開店資金: <span className="text-emerald-400">$500.00</span></div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                食パン・小麦粉などの基本仕入れからスタート。隣の倉庫は<span className="text-amber-400 font-bold">$800</span>で拡張可能！
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-sky-500/25 border border-sky-400 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>開店して店に入る</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
