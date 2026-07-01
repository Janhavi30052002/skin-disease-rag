export default function ExplanationCard({
  knowledge,
}) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">

      <h2 className="text-2xl font-bold">
        Clinical Explanation
      </h2>

      <div className="mt-6 rounded-xl bg-slate-50 p-6 border">

        {knowledge ? (

          <pre className="whitespace-pre-wrap font-sans leading-8 text-slate-700">
            {knowledge}
          </pre>

        ) : (

          <p className="text-slate-500">
            Upload an image to generate an explanation.
          </p>

        )}

      </div>

    </div>
  );
}