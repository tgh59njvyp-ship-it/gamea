import React, { useState } from 'react';
import { CustomerData, ProductItem } from '../../types/game';
import { soundManager } from '../../utils/audio';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Coins,
  Receipt,
  User,
  Sparkles,
} from 'lucide-react';

interface CheckoutInterfaceProps {
  customer: CustomerData | null;
  productsMap: Map<string, ProductItem>;
  scannedIndex: number;
  onScanNext: () => void;
  onCompleteCheckout: (amountCollected: number, changeGiven: number) => void;
  onClose: () => void;
}

export const CheckoutInterface: React.FC<CheckoutInterfaceProps> = ({
  customer,
  productsMap,
  scannedIndex,
  onScanNext,
  onCompleteCheckout,
  onClose,
}) => {
  if (!customer) {
    return (
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">レジにお客さんはいません</h3>
          <p className="text-sm text-slate-400 mb-6">
            売り場で商品を選んでいるお客さんがレジに来るまでお待ちください。
          </p>
          <button
            id="btn-close-empty-register"
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl border border-slate-700 transition-all"
          >
            売り場に戻る
          </button>
        </div>
      </div>
    );
  }

  // Calculate Cart Totals
  const totalItems = customer.cart.length;
  const scannedItems = customer.cart.slice(0, scannedIndex);
  const totalBill = customer.cart.reduce((sum, item) => sum + item.pricePaid * item.quantity, 0);

  // Cash change handling state
  const cashGiven =
    customer.paymentMethod === 'cash'
      ? customer.cashGiven || Math.ceil(totalBill + 5)
      : totalBill;
  const requiredChange = Math.max(0, Number((cashGiven - totalBill).toFixed(2)));
  const [changeSelected, setChangeSelected] = useState<number>(0);

  const isAllScanned = scannedIndex >= totalItems;
  const isChangeCorrect =
    customer.paymentMethod === 'card' ||
    Math.abs(changeSelected - requiredChange) < 0.01;

  const handleAddChange = (value: number) => {
    soundManager.playCoin();
    setChangeSelected((prev) => Number((prev + value).toFixed(2)));
  };

  const handleClearChange = () => {
    soundManager.playCoin();
    setChangeSelected(0);
  };

  const handleFinish = () => {
    soundManager.playCashRegister();
    onCompleteCheckout(cashGiven, changeSelected);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row text-slate-100">
        
        {/* Left Side: Customer & Conveyor Items */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            {/* Header / Customer Info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md"
                  style={{ backgroundColor: customer.avatarColor }}
                >
                  👤
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{customer.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>お買い物点数: {totalItems}点</span>
                    <span>・</span>
                    <span className="text-amber-400 font-semibold">
                      {customer.paymentMethod === 'cash' ? '💵 現金払い' : '💳 クレジットカード'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mood Badge */}
              <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                {customer.mood === 'happy' && <span className="text-emerald-400">😊 笑顔</span>}
                {customer.mood === 'neutral' && <span className="text-sky-400">👍 普通</span>}
                {customer.mood === 'annoyed' && <span className="text-amber-400">😠 焦り</span>}
                {customer.mood === 'angry' && <span className="text-rose-400">🤬 不満</span>}
              </div>
            </div>

            {/* Conveyor Belt Items List */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>コンベア上の購入商品</span>
              <span className="text-sky-400">{scannedIndex} / {totalItems} スキャン済み</span>
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {customer.cart.map((cartItem, idx) => {
                const product = productsMap.get(cartItem.productId);
                const isScanned = idx < scannedIndex;

                return (
                  <div
                    key={`cart_ui_${idx}`}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isScanned
                        ? 'bg-slate-800/40 border-slate-800/80 opacity-60'
                        : idx === scannedIndex
                        ? 'bg-sky-950/60 border-sky-500/80 ring-2 ring-sky-500/30'
                        : 'bg-slate-800/80 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: product?.color || '#38bdf8' }}
                      />
                      <span className="font-semibold text-sm text-slate-200">
                        {product?.name || '商品'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-emerald-400">
                        ¥{cartItem.pricePaid.toLocaleString()}
                      </span>
                      {isScanned ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : idx === scannedIndex ? (
                        <span className="text-xs font-bold text-sky-400 bg-sky-900/60 px-2 py-0.5 rounded-md border border-sky-500/40">
                          次スキャン
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">待機</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scanner Action Button */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            {!isAllScanned ? (
              <button
                id="btn-scan-barcode"
                onClick={() => {
                  soundManager.playScanBeep();
                  onScanNext();
                }}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 transition-all active:scale-98 border border-sky-400/30"
              >
                <QrCode className="w-6 h-6" />
                <span>バーコードスキャン (BEEP!)</span>
              </button>
            ) : (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>全商品のスキャンが完了しました！</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Register POS Screen & Cash Change Calculator */}
        <div className="flex-1 p-6 bg-slate-900/50 flex flex-col justify-between">
          <div>
            {/* POS Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-base text-white">レジ会計端末</h3>
              </div>
              <button
                id="btn-close-register-modal"
                onClick={onClose}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">小計 (スキャン済み)</span>
                <span className="text-xl font-extrabold text-white">
                  ${scannedItems.reduce((s, i) => s + i.pricePaid, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800">
                <span>合計金額 (全{totalItems}点)</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ${totalBill.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Cash Payment Change Calculator */}
            {customer.paymentMethod === 'cash' ? (
              <div className="space-y-3">
                <div className="flex justify-between text-xs bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-300">お客様のお預かり金額:</span>
                  <span className="font-bold text-amber-300 text-sm">${cashGiven.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-300">必要なお釣り (計算値):</span>
                  <span className="font-bold text-emerald-400 text-sm">${requiredChange.toFixed(2)}</span>
                </div>

                {/* Change Selector Drawer */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                  <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                    <span>お釣りのコイン・紙幣をタップ</span>
                    <button
                      id="btn-clear-change"
                      onClick={handleClearChange}
                      className="text-[11px] text-rose-400 hover:underline font-semibold"
                    >
                      リセット
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {[0.05, 0.10, 0.25, 1.0].map((val) => (
                      <button
                        key={`coin_${val}`}
                        id={`btn-coin-${val}`}
                        onClick={() => handleAddChange(val)}
                        className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 text-xs font-bold py-2 rounded-xl border border-amber-500/30 flex flex-col items-center justify-center shadow-sm"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                        <span>+${val < 1 ? val.toFixed(2) : val.toFixed(0)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mb-3">
                    {[5.0, 10.0, 20.0, 50.0].map((val) => (
                      <button
                        key={`bill_${val}`}
                        id={`btn-bill-${val}`}
                        onClick={() => handleAddChange(val)}
                        className="bg-emerald-950/80 hover:bg-emerald-900 active:scale-95 text-emerald-300 text-xs font-bold py-2 rounded-xl border border-emerald-500/40 flex flex-col items-center justify-center shadow-sm"
                      >
                        <Banknote className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                        <span>+${val.toFixed(0)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">渡し予定のお釣り:</span>
                    <span
                      className={`font-extrabold text-base ${
                        Math.abs(changeSelected - requiredChange) < 0.01
                          ? 'text-emerald-400'
                          : changeSelected > requiredChange
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      ${changeSelected.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">
                <CreditCard className="w-10 h-10 text-sky-400 mx-auto mb-2 animate-bounce" />
                <h4 className="font-bold text-sm text-white mb-1">クレジットカード決済処理中</h4>
                <p className="text-xs text-slate-400">
                  お客様が決済端末にカードをタッチしました。
                </p>
              </div>
            )}
          </div>

          {/* Complete Checkout Button */}
          <div className="mt-6">
            <button
              id="btn-finish-checkout"
              disabled={!isAllScanned || !isChangeCorrect}
              onClick={handleFinish}
              className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-xl transition-all ${
                isAllScanned && isChangeCorrect
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-98 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>会計を完了して商品を渡す (レシート発行)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
