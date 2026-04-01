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
        <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Portfolio Breakdown</h2>
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