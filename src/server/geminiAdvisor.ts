import { GoogleGenAI } from '@google/genai';

export interface AdvisorRequest {
  storeName: string;
  day: number;
  cash: number;
  reputation: number;
  salesCount: number;
  revenueToday: number;
  topProducts: { name: string; currentPrice: number; wholesaleCost: number }[];
  customerFeedback: string[];
}

export interface AdvisorResponse {
  summary: string;
  pricingAdvice: { productName: string; tip: string; suggestedPrice: number }[];
  marketingTip: string;
  reputationAdvice: string;
  overallRating: 'A' | 'B' | 'C' | 'S';
}

export async function getGeminiRetailAdvice(data: AdvisorRequest): Promise<AdvisorResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Fallback baseline advice if key is not configured yet
    return {
      summary: `店舗『${data.storeName}』の運営は堅調です！現在${data.day}日目で所持金は¥${data.cash.toLocaleString()}です。`,
      pricingAdvice: data.topProducts.slice(0, 3).map((p) => ({
        productName: p.name,
        tip: `卸値¥${p.wholesaleCost}に対して現在価格¥${p.currentPrice}。適切な利益率です。`,
        suggestedPrice: Math.round(p.wholesaleCost * 1.4),
      })),
      marketingTip: 'ドリンク類とスナック類を棚の目立つ位置に集めると、客単価がアップします。',
      reputationAdvice: 'レジ待ち時間を減らすと店舗評価（評判）がさらに上がります。',
      overallRating: data.reputation >= 80 ? 'S' : data.reputation >= 60 ? 'A' : 'B',
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `あなたは日本のスーパーマーケット経営コンサルタントAIです。
現在の店舗データに基づき、売上アップと顧客満足度向上のためのアドバイスをJSON形式で提供してください。

【店舗データ】
- 店名: ${data.storeName}
- 経過日数: ${data.day}日目
- 資金: ¥${data.cash}
- 評判スコア: ${data.reputation}/100
- 本日の販売点数: ${data.salesCount}点
- 本日の売上高: ¥${data.revenueToday}
- 販売商品例: ${JSON.stringify(data.topProducts)}
- 最近の客の声: ${data.customerFeedback.slice(-5).join(', ')}

【出力要求】
必ず有効なJSONのみを出力してください。形式:
{
  "summary": "総合評価の概要メッセージ（100文字程度）",
  "pricingAdvice": [
    { "productName": "商品名", "tip": "価格設定への具的アドバイス", "suggestedPrice": 200 }
  ],
  "marketingTip": "マーケティング・陳列・品揃えの提案",
  "reputationAdvice": "評判を上げるためのアドバイス",
  "overallRating": "S" または "A" または "B" または "C"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as AdvisorResponse;
      return parsed;
    }
  } catch (err) {
    console.error('Gemini Advisor Error:', err);
  }

  return {
    summary: `店舗『${data.storeName}』の運営レビュー: 利益率と棚卸のバランスを意識しましょう。`,
    pricingAdvice: [],
    marketingTip: '生鮮食品と冷たい飲料の需要が高まっています。発注を強化しましょう！',
    reputationAdvice: 'レジのスキャン速度を維持して顧客満足度を高めましょう。',
    overallRating: 'B',
  };
}
