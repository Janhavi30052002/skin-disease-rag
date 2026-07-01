import { diseaseMap } from "@/utils/diseaseMap";

export default function SimilarCasesTable({
  similarCases,
}) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">

      <h2 className="text-2xl font-bold">
        Similar Cases
      </h2>

      <div className="mt-6 overflow-x-auto rounded-xl border">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Diagnosis
              </th>

              <th className="px-4 py-3 text-center">
                Similarity
              </th>

              <th className="px-4 py-3 text-center">
                Age
              </th>

              <th className="px-4 py-3 text-center">
                Sex
              </th>

              <th className="px-4 py-3 text-center">
                Location
              </th>

            </tr>

          </thead>

          <tbody>

            {similarCases.length ? (

              similarCases.map((item, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-4 py-4">
                    {diseaseMap[item.diagnosis]}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {(item.score * 100).toFixed(1)}%
                  </td>

                  <td className="px-4 py-4 text-center">
                    {item.age}
                  </td>

                  <td className="px-4 py-4 text-center capitalize">
                    {item.sex}
                  </td>

                  <td className="px-4 py-4 text-center capitalize">
                    {item.localization}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={5}
                  className="py-10 text-center text-slate-500"
                >
                  No similar cases available.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}