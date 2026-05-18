interface StatCardProps {
    title: string
    value: string
    color: string
}

export default function StatCard({title , value , color}: StatCardProps){
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-2 shadow-2xl hover:-translate-y-1 hover:border-white/20 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{title}</p>
          <p className={`text-3xl font-extrabold ${color} tracking-tight drop-shadow-md`}>{value}</p>
        </div>
    )
}