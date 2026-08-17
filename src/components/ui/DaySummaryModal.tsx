import React from 'react';
import { TodayStats } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { Award, DollarSign, TrendingUp, Users, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

interface DaySummaryModalProps {
  day: number;
  stats: TodayStats;
  onNextDay: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({ day, stats, onNextDay }) => {
  const netProfit = stats.revenue - stats.wholesaleExpenses - stats.staffWages - stats.rentUtilities;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-100 flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>スーパーマーケット・シミュレーター</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">DAY {day} 営業結果・日次決算</h2>
          <p className="text-sky-100 text-xs mt-1 font-medium">本日の収支報告と来店状況まとめ</p>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Net Profit Highlights Card */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              netProfit >= 0
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">本日純利益 (Net Profit)</span>
              <div className="text-2xl font-black mt-0.5">
                {netProfit >= 0 ? '+' : ''}¥{netProfit.toLocaleString()}
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                netProfit >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Detailed Financial Breakdown */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> 売上高 (Revenue)
              </span>
              <span className="font-bold text-emerald-400">+¥{stats.revenue.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-sky-400" /> 商品仕入費 (Wholesale Cost)
              </span>
              <span className="font-semibold text-rose-400">-¥{stats.wholesaleExpenses.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> スタッフ給与 (Staff Wages)
              </span>
              <span className="font-semibold text-rose-400">-¥{stats.staffWages.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> 光熱費・店舗維費 (Rent & Utilities)
              </span>
              <span className="font-semibold text-rose-400">-¥{stats.rentUtilities.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer & Store Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                👥
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">来店・会計顧客数</div>
                <div className="font-extrabold text-sm text-slate-100">{stats.customersServed} 人</div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                🛒
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">販売総商品数</div>
                <div className="font-extrabold text-sm text-slate-100">{stats.itemsSold} 個</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Next Day Action */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            id="btn-next-day-confirm"
            onClick={() => {
              soundManager.playLevelUp();
              onNextDay();
            }}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>翌日 (DAY {day + 1}) の開店準備へ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
