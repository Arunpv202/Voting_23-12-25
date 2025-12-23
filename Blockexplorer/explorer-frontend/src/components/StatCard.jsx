export default function StatCard({ title, value }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-semibold mt-2">
        {value}
      </p>
    </div>
  );
}
