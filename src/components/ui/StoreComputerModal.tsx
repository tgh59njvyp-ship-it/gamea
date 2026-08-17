import React, { useState } from 'react';
import { GameState, ProductItem, ShelfType } from '../../types/game';
import { INITIAL_LICENSES } from '../../utils/constants';
import { soundManager } from '../../utils/audio';
import {
  X,
  PackagePlus,
  Tag,
  TrendingUp,
  BarChart3,
  Bot,
  Store,
  CheckCircle2,
  AlertTriangle,
  Users,
  Sparkles,
  ArrowUpRight,
  Award,
  Box,
  Lock,
  Unlock,
} from 'lucide-react';

interface StoreComputerModalProps {
  gameState: GameState;
  productsMap: Map<string, ProductItem>;
  onOrderStockBox: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onBuyShelf: (type: ShelfType) => void;
  onHireStaff: (staffId: string) => void;
  onBuyLicense: (licenseId: string, cost: number) => void;
  onUnlockStorage: () => void;
  onClose: () => void;
}

export const StoreComputerModal: React.FC<StoreComputerModalProps> = ({
  gameState,
  productsMap,
  onOrderStockBox,
  onUpdatePrice,
  onBuyShelf,
  onHireStaff,
  onBuyLicense,
  onUnlockStorage,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'order' | 'pricing' | 'licenses' | 'upgrades' | 'financials' | 'gemini'
  >('order');

  // Gemini AI Advisor State
  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const [geminiAdvice, setGeminiAdvice] = useState<{
    summary: string;
    pricingAdvice: { productName: string; tip: string; suggestedPrice: number }[];
    marketingTip: string;
    reputationAdvice: string;
    overallRating: string;
  } | null>(null);

  const productsList: ProductItem[] = Array.from(productsMap.values());

  const handleFetchGeminiAdvice = async () => {
    setGeminiLoading(true);
    try {
      const payload = {
        storeName: gameState.storeName,
        day: gameState.day,
        cash: gameState.cash,
        reputation: gameState.reputation,
        salesCount: 42,
        revenueToday: 18500,
        topProducts: productsList.map((p) => ({
          name: p.name,
          currentPrice: p.currentPrice,
          wholesaleCost: p.wholesaleCost,
        })),
        customerFeedback: [
          '牛乳の価格が安くて助かる！',
          'お肉が少し高く感じる...',
          '棚の品揃えが良くて満足',
        ],
      };

      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setGeminiAdvice(data);
      soundManager.playLevelUp();
    } catch (err) {
      console.error('Gemini fetch error:', err);
    } finally {
      setGeminiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full h-[88vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Laptop Header Bar */}
        <div className="bg-slate-950 p-3 md:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              💻
            </div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-white">{gameState.storeName} 管理端末</h3>
              <p className="text-[10px] md:text-[11px] text-slate-400">バックオフィス経営ポータル v2.4</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              id="tab-order"
              onClick={() => setActiveTab('order')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'order'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>在庫発注</span>
            </button>

            <button
              id="tab-pricing"
              onClick={() => setActiveTab('pricing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'pricing'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>価格設定</span>
            </button>

            <button
              id="tab-licenses"
              onClick={() => setActiveTab('licenses')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'licenses'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ライセンス</span>
            </button>

            <button
              id="tab-upgrades"
              onClick={() => setActiveTab('upgrades')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'upgrades'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>設備・拡張</span>
            </button>

            <button
              id="tab-financials"
              onClick={() => setActiveTab('financials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'financials'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>損益分析</span>
            </button>

            <button
              id="tab-gemini"
              onClick={() => setActiveTab('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'gemini'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Gemini AI</span>
            </button>
          </div>

          <button
            id="btn-close-laptop-modal"
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: STOCK ORDERING CATALOG */}
          {activeTab === 'order' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg text-white">問屋卸発注カタログ</h4>
                  <p className="text-xs text-slate-400">
                    商品をまとめて発注すると、バックルームの搬入口に段ボール箱が届きます。
                  </p>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-emerald-400">
                  現在資金: ${gameState.cash.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsList.map((product) => {
                  const boxPrice = product.wholesaleCost * product.boxQuantity;
                  const canAfford = gameState.cash >= boxPrice;

                  return (
                    <div
                      key={`catalog_${product.id}`}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: product.color }}
                            />
                            <span className="font-bold text-sm text-white">{product.name}</span>
                          </div>
                          <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                            {product.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mb-3">{product.description}</p>

                        <div className="bg-slate-900/80 p-2.5 rounded-xl text-xs space-y-1 mb-3 border border-slate-800">
                          <div className="flex justify-between text-slate-400">
                            <span>1箱あたりの個数:</span>
                            <span className="text-white font-bold">{product.boxQuantity}点入り</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>卸単価:</span>
                            <span className="text-slate-200 font-semibold">
                              ${product.wholesaleCost.toFixed(2)} /点
                            </span>
                          </div>
                          <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                            <span className="text-slate-300">発注箱価格:</span>
                            <span className="text-emerald-400">${boxPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        id={`btn-order-${product.id}`}
                        disabled={!canAfford}
                        onClick={() => {
                          soundManager.playCoin();
                          onOrderStockBox(product.id);
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                          canAfford
                            ? 'bg-sky-500 hover:bg-sky-400 text-white active:scale-98 cursor-pointer'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <PackagePlus className="w-4 h-4" />
                        <span>1箱発注する (${boxPrice.toFixed(2)})</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PRICING MANAGER */}
          {activeTab === 'pricing' && (
            <div>
              <div className="mb-4">
                <h4 className="font-bold text-lg text-white">販売価格の設定</h4>
                <p className="text-xs text-slate-400">
                  適正な販売価格を設定しましょう。高すぎるとお客さんが買わずに帰り、安すぎると利益が出ません。
                </p>
              </div>

              <div className="space-y-3">
                {productsList.map((product) => {
                  const marginPercent = Math.round(
                    ((product.currentPrice - product.wholesaleCost) / product.wholesaleCost) * 100
                  );

                  return (
                    <div
                      key={`pricing_${product.id}`}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: product.color }}
                        />
                        <div>
                          <h5 className="font-bold text-sm text-white">{product.name}</h5>
                          <div className="text-xs text-slate-400">
                            仕入値: ${product.wholesaleCost.toFixed(2)} | 推奨価格: ${product.recommendedPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Profit Margin Badge */}
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">利益率</div>
                          <div
                            className={`font-bold text-xs ${
                              marginPercent > 60
                                ? 'text-amber-400'
                                : marginPercent > 20
                                ? 'text-emerald-400'
                                : 'text-slate-400'
                            }`}
                          >
                            +{marginPercent}%
                          </div>
                        </div>

                        {/* Price Controls */}
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                          <button
                            id={`btn-price-down-${product.id}`}
                            onClick={() =>
                              onUpdatePrice(
                                product.id,
                                Math.max(0.1, Number((product.currentPrice - 0.25).toFixed(2)))
                              )
                            }
                            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center active:scale-95"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-emerald-400 text-sm min-w-16 text-center">
                            ${product.currentPrice.toFixed(2)}
                          </span>
                          <button
                            id={`btn-price-up-${product.id}`}
                            onClick={() =>
                              onUpdatePrice(
                                product.id,
                                Number((product.currentPrice + 0.25).toFixed(2))
                              )
                            }
                            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: LICENSES */}
          {activeTab === 'licenses' && (
            <div>
              <div className="mb-4">
                <h4 className="font-bold text-lg text-white">商品仕入れライセンス購入</h4>
                <p className="text-xs text-slate-400">
                  新商品の取り扱いライセンスを取得して、高単価・高利益率の品揃えを拡充しましょう。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_LICENSES.map((lic) => {
                  const isUnlocked = gameState.unlockedLicenses.includes(lic.id);

                  return (
                    <div
                      key={`license_${lic.id}`}
                      className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                        isUnlocked
                          ? 'bg-slate-800/40 border-emerald-500/40'
                          : 'bg-slate-800/90 border-slate-700/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-base text-white flex items-center gap-2">
                            <Award className={`w-5 h-5 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`} />
                            {lic.name}
                          </h5>
                          {isUnlocked ? (
                            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Unlock className="w-3 h-3" /> 取得済み
                            </span>
                          ) : (
                            <span className="bg-slate-900 text-slate-400 border border-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" /> 未解放
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mb-4">{lic.description}</p>
                      </div>

                      {!isUnlocked && (
                        <button
                          id={`btn-buy-license-${lic.id}`}
                          disabled={gameState.cash < lic.cost}
                          onClick={() => {
                            soundManager.playLevelUp();
                            onBuyLicense(lic.id, lic.cost);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:bg-slate-700 disabled:from-slate-700 disabled:to-slate-700 text-slate-950 disabled:text-slate-400 font-extrabold rounded-xl text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          <span>ライセンスを取得する (${lic.cost.toFixed(2)})</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: UPGRADES & EQUIPMENT */}
          {activeTab === 'upgrades' && (
            <div>
              <div className="mb-4">
                <h4 className="font-bold text-lg text-white">什器・設備投資・店舗拡張</h4>
                <p className="text-xs text-slate-400">
                  棚を増設して陳列量を増やしたり、隣の倉庫（$800で拡張）やスタッフ雇用で効率化を図りましょう。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Unlock Backroom Storage ($800) */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-base text-white flex items-center gap-2">
                        <Box className="w-5 h-5 text-amber-400" /> 隣の倉庫部屋の解放
                      </h5>
                      {gameState.unlockedStorage && (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          拡張済み
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      店舗隣のバックルーム倉庫を解放。届いた段ボールをまとめて保管できます！
                    </p>
                  </div>
                  {!gameState.unlockedStorage ? (
                    <button
                      id="btn-unlock-storage"
                      disabled={gameState.cash < 800}
                      onClick={() => {
                        soundManager.playLevelUp();
                        onUnlockStorage();
                      }}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:bg-slate-700 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      倉庫を解放する ($800.00)
                    </button>
                  ) : (
                    <div className="text-center text-xs font-bold text-emerald-400 bg-emerald-950/40 py-2 rounded-xl border border-emerald-500/30">
                      ✓ バックルーム倉庫 使用可能
                    </div>
                  )}
                </div>

                {/* Buy Standard Rack */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-base text-white mb-1">ドライ商品棚の増設</h5>
                    <p className="text-xs text-slate-400 mb-3">
                      スナックや小麦粉、日用品を大量に陳列できるメタルシェルフ。
                    </p>
                  </div>
                  <button
                    id="btn-buy-standard-rack"
                    disabled={gameState.cash < 300}
                    onClick={() => {
                      soundManager.playLevelUp();
                      onBuyShelf(ShelfType.STANDARD_RACK);
                    }}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    棚を設置する ($300.00)
                  </button>
                </div>

                {/* Buy Refrigerator */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-base text-white mb-1">冷蔵ショーケースの増設</h5>
                    <p className="text-xs text-slate-400 mb-3">
                      牛乳、ジュース、ソーダを冷やして陳列できるガラス棚。
                    </p>
                  </div>
                  <button
                    id="btn-buy-refrigerator"
                    disabled={gameState.cash < 600}
                    onClick={() => {
                      soundManager.playLevelUp();
                      onBuyShelf(ShelfType.REFRIGERATOR);
                    }}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    冷蔵棚を設置する ($600.00)
                  </button>
                </div>
              </div>

              {/* Staff Hiring */}
              <h5 className="font-bold text-sm text-slate-300 mb-3">スタッフ雇用管理</h5>
              <div className="space-y-3">
                {gameState.staff.map((st) => (
                  <div
                    key={`staff_${st.id}`}
                    className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <h6 className="font-bold text-sm text-white">{st.name}</h6>
                      <p className="text-xs text-slate-400">
                        日給: ${st.dailySalary.toFixed(2)} | 処理速度: 高速
                      </p>
                    </div>

                    {st.hired ? (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> 雇用中
                      </span>
                    ) : (
                      <button
                        id={`btn-hire-${st.id}`}
                        disabled={gameState.cash < st.dailySalary}
                        onClick={() => {
                          soundManager.playLevelUp();
                          onHireStaff(st.id);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        雇用する (日給${st.dailySalary.toFixed(2)})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL ANALYTICS */}
          {activeTab === 'financials' && (
            <div>
              <div className="mb-4">
                <h4 className="font-bold text-lg text-white">日次損益・経営レポート</h4>
                <p className="text-xs text-slate-400">
                  日々の売上高、仕入コスト、営業利益の推移をデータ分析できます。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium mb-1">本日売上高</div>
                  <div className="text-xl font-extrabold text-emerald-400">¥18,500</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium mb-1">本日販売点数</div>
                  <div className="text-xl font-extrabold text-sky-400">42 点</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium mb-1">平均客単価</div>
                  <div className="text-xl font-extrabold text-amber-400">¥1,230</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GEMINI AI ADVISOR */}
          {activeTab === 'gemini' && (
            <div>
              <div className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Gemini AI リテール・コンサルタント</h4>
                    <p className="text-xs text-purple-200/80">
                      最新のGemini 3.7 Flashモデルがあなたの店舗経営データを多角的に分析します。
                    </p>
                  </div>
                </div>

                <button
                  id="btn-run-gemini-advisor"
                  disabled={geminiLoading}
                  onClick={handleFetchGeminiAdvice}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {geminiLoading
                      ? 'Gemini AIが分析中...'
                      : '経営データをAIで分析・アドバイスを生成'}
                  </span>
                </button>
              </div>

              {geminiAdvice && (
                <div className="space-y-4">
                  {/* Rating Grade */}
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white mb-1">AI 総合評価</h5>
                      <p className="text-xs text-slate-300">{geminiAdvice.summary}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-extrabold text-3xl flex items-center justify-center shadow-inner">
                      {geminiAdvice.overallRating}
                    </div>
                  </div>

                  {/* Pricing Tips */}
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                    <h5 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-sky-400" />
                      <span>商品価格設定へのAIアドバイス</span>
                    </h5>
                    <div className="space-y-2">
                      {geminiAdvice.pricingAdvice?.map((tip, idx) => (
                        <div key={`tip_${idx}`} className="bg-slate-900/80 p-3 rounded-xl text-xs">
                          <span className="font-bold text-sky-400">{tip.productName}: </span>
                          <span className="text-slate-300">{tip.tip} </span>
                          <span className="text-emerald-400 font-bold ml-1">
                            (推奨改定価格: ¥{tip.suggestedPrice})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marketing Tip */}
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                    <h5 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>マーケティング・陳列改善案</span>
                    </h5>
                    <p className="text-xs text-slate-300">{geminiAdvice.marketingTip}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
