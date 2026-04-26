import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart
} from "recharts";

// サンプルデータ（実際は外部から取得 or 入力）
const sampleData = {
  ticker: "8058",
  name: "三菱商事",
  years: [
    {
      year: "2020",
      revenue: 14800,       // 売上高（億円）
      operatingProfit: 380, // 営業利益（億円）
      ordinaryProfit: 420,  // 経常利益（億円）
      netProfit: 172,       // 当期純利益（億円）
      eps: 112,             // 1株当たり利益（円）
      dividend: 70,         // 配当金（円）
      payoutRatio: 62.5,    // 配当性向（%）
      yield: 3.8,           // 配当利回り（%）
    },
    {
      year: "2021",
      revenue: 17230,
      operatingProfit: 520,
      ordinaryProfit: 580,
      netProfit: 243,
      eps: 158,
      dividend: 80,
      payoutRatio: 50.6,
      yield: 3.2,
    },
    {
      year: "2022",
      revenue: 21610,
      operatingProfit: 890,
      ordinaryProfit: 960,
      netProfit: 937,
      eps: 610,
      dividend: 150,
      payoutRatio: 24.6,
      yield: 2.8,
    },
    {
      year: "2023",
      revenue: 19640,
      operatingProfit: 1010,
      ordinaryProfit: 1080,
      netProfit: 1149,
      eps: 748,
      dividend: 200,
      payoutRatio: 26.7,
      yield: 3.1,
    },
    {
      year: "2024",
      revenue: 18290,
      operatingProfit: 980,
      ordinaryProfit: 1050,
      netProfit: 1063,
      eps: 710,
      dividend: 210,
      payoutRatio: 29.6,
      yield: 3.4,
    },
  ],
};

const TABS = ["配当推移", "業績推移", "経常利益", "配当性向"];

const formatYen = (v) => `¥${v.toLocaleString()}`;
const formatOku = (v) => `${v.toLocaleString()}億`;

export default function DividendTrackerSample() {
  const [activeTab, setActiveTab] = useState("配当推移");
  const { name, ticker, years } = sampleData;

  const latest = years[years.length - 1];

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 860, margin: "0 auto", padding: 24 }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>
          {name}
          <span style={{ fontSize: 14, color: "#888", marginLeft: 8 }}>（{ticker}）</span>
        </h1>
      </div>

      {/* サマリーカード */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "直近配当", value: formatYen(latest.dividend), sub: `前年比 +${latest.dividend - years[years.length - 2].dividend}円` },
          { label: "配当利回り", value: `${latest.yield}%`, sub: "直近期末" },
          { label: "配当性向", value: `${latest.payoutRatio}%`, sub: "当期" },
          { label: "EPS", value: formatYen(latest.eps), sub: "1株利益" },
        ].map((card) => (
          <div key={card.label} style={{ background: "#f8f9fa", borderRadius: 10, padding: "14px 16px", border: "1px solid #e0e0e0" }}>
            <div style={{ fontSize: 12, color: "#888" }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: "bold", margin: "4px 0" }}>{card.value}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* タブ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 18px",
              borderRadius: 20,
              border: "1px solid #ccc",
              background: activeTab === tab ? "#1a73e8" : "#fff",
              color: activeTab === tab ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: activeTab === tab ? "bold" : "normal",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* グラフエリア */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: 20 }}>
        {activeTab === "配当推移" && (
          <>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>配当金・EPS 推移（円）</h2>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={years}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(v, name) => [`¥${v}`, name]} />
                <Legend />
                <Bar yAxisId="left" dataKey="dividend" name="配当金（円）" fill="#4caf50" />
                <Line yAxisId="right" type="monotone" dataKey="eps" name="EPS（円）" stroke="#1a73e8" strokeWidth={2} dot />
              </ComposedChart>
            </ResponsiveContainer>
          </>
        )}

        {activeTab === "業績推移" && (
          <>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>売上高・当期純利益 推移（億円）</h2>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={years}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" tickFormatter={formatOku} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={formatOku} />
                <Tooltip formatter={(v) => `${v.toLocaleString()}億円`} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="売上高" fill="#90caf9" />
                <Line yAxisId="right" type="monotone" dataKey="netProfit" name="当期純利益" stroke="#e53935" strokeWidth={2} dot />
              </ComposedChart>
            </ResponsiveContainer>
          </>
        )}

        {activeTab === "経常利益" && (
          <>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>営業利益・経常利益 推移（億円）</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={years}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatOku} />
                <Tooltip formatter={(v) => `${v.toLocaleString()}億円`} />
                <Legend />
                <Bar dataKey="operatingProfit" name="営業利益" fill="#ffa726" />
                <Bar dataKey="ordinaryProfit" name="経常利益" fill="#ab47bc" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeTab === "配当性向" && (
          <>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>配当性向 推移（%）</h2>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={years}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
                <Bar dataKey="payoutRatio" name="配当性向（%）" fill="#80cbc4" />
                <Line type="monotone" dataKey="payoutRatio" stroke="#00796b" strokeWidth={2} dot={false} legendType="none" />
              </ComposedChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
              ※ 配当性向 = 配当金 ÷ EPS × 100。50%以下が一般的に健全とされます。
            </p>
          </>
        )}
      </div>

      {/* データテーブル */}
      <div style={{ marginTop: 24, overflowX: "auto" }}>
        <h2 style={{ fontSize: 15 }}>年度別データ一覧</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f1f3f4" }}>
              {["年度", "売上高", "経常利益", "純利益", "EPS", "配当金", "配当性向", "利回り"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "right", borderBottom: "2px solid #ddd", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((row) => (
              <tr key={row.year} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}>{row.year}</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{row.revenue.toLocaleString()}億</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{row.ordinaryProfit.toLocaleString()}億</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{row.netProfit.toLocaleString()}億</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>¥{row.eps}</td>
                <td style={{ padding: "8px 12px", textAlign: "right", color: "#388e3c", fontWeight: "bold" }}>¥{row.dividend}</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{row.payoutRatio}%</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{row.yield}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
