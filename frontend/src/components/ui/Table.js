"use client";

export default function Table({ columns = [], data = [] }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm p-4">Nenhum registro encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-3 font-semibold text-gray-700 uppercase text-xs tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-3 align-top">
                  {typeof row[col.accessor] === "object" ||
                  typeof row[col.accessor] === "function"
                    ? row[col.accessor] // permite componentes React (ex: botões)
                    : row[col.accessor] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
