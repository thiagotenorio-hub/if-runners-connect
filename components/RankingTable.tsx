type RankingRow = {
  id: string;
  position: number;
  name: string;
  category: string;
  points: number;
  mainData: string;
};

type RankingTableProps = {
  title: string;
  description: string;
  rows: RankingRow[];
};

export function RankingTable({ title, description, rows }: RankingTableProps) {
  return (
    <section className="overflow-hidden rounded border border-forest/15 bg-white shadow-md">
      <div className="border-b border-forest/10 bg-track p-5">
        <h2 className="text-xl font-black text-graphite">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-graphite/70">{description}</p>
      </div>

      {rows.length === 0 ? (
        <div className="p-6 text-sm text-graphite/70">
          Ainda não há dados suficientes para este ranking.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-graphite text-xs uppercase text-white/85">
              <tr>
                <th className="px-4 py-3">Posição</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Pontos</th>
                <th className="px-4 py-3">Dados principais</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-graphite/10 hover:bg-sun/15">
                  <td className="px-4 py-4 font-black text-pace">
                    {row.position}
                  </td>
                  <td className="px-4 py-4 font-semibold text-graphite">
                    {row.name}
                  </td>
                  <td className="px-4 py-4 text-graphite/70">
                    {row.category}
                  </td>
                  <td className="px-4 py-4 font-bold text-graphite">
                    {row.points}
                  </td>
                  <td className="px-4 py-4 text-graphite/70">
                    {row.mainData}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
