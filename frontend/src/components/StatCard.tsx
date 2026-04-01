interface StatCardProps {
    title: string
    value: string
    color: string
}

export default function StatCard({title , value , color}: StatCardProps){
    return (
        <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-2">
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color} `}>{value}</p>
        </div>
    )
}