export default function StatCard({ value, label, icon, variant = "gold" }) {
  const colorVariants = {
    gold: "bg-[#B49252] text-white",
  };
  const iconColorClass = colorVariants[variant];
  const valueColors = {
    gold: "text-[#B49252]",
  };
  const valueColorClass = valueColors[variant];
  
  return (
    <div className="bg-[#1C1C1E] rounded-2xl shadow-sm p-4 w-full flex items-center gap-4">
      <div className={`${iconColorClass} p-3 rounded-full w-12 h-12 flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <h2 className={`text-2xl font-bold ${valueColorClass} font-inter`}>{value}</h2>
        <p className="text-gray-500 text-sm font-inter">{label}</p>
      </div>
    </div>
  );
}