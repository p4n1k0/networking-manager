export default function Card({ title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
