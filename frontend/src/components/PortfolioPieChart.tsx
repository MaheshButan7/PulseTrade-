import {PieChart , Pie , Cell , Tooltip , Legend} from "recharts"

interface Props {
    holdings: { symbol: string; value: number }[]
    balance: number
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"]

export default function PortfolioPieChart({ holdings, balance }: Props) {
    const chartData = [
        ...holdings.map(h => ({ name: h.symbol, value: Math.round(h.value) })),
        { name: "Cash", value: Math.round(balance) }
    ]

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-xl font-bold mb-4 tracking-tight drop-shadow-sm">Portfolio Breakdown</h2>
            <div className="flex justify-center">
            <PieChart width={500} height={300}>
                <Pie
                    data={chartData}
                    cx={200}
                    cy={140}
                    outerRadius={100}
                    dataKey="value"
                >
                    {chartData.map((_, index) => (
                        <Cell key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                />
                <Legend />
            </PieChart>
        </div>
        </div>
    )
}