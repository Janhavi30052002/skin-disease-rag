import {
  FileText,
  Activity,
  Pill,
  AlertTriangle,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

const sectionIcons = {
  description: <FileText size={20} />,
  symptoms: <Activity size={20} />,
  causes: <AlertTriangle size={20} />,
  treatment: <Pill size={20} />,
  prevention: <ShieldCheck size={20} />,
  diagnosis: <ClipboardList size={20} />,
};

const sectionColors = {
  description:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

  symptoms:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

  causes:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",

  treatment:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

  prevention:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",

  diagnosis:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export default function ClinicalExplanation({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div
        className="
        rounded-2xl
        border
        border-dashed
        border-slate-300
        dark:border-slate-700
        p-12
        text-center
        "
      >
        <FileText
          size={60}
          className="mx-auto text-slate-400"
        />

        <h3 className="mt-5 text-xl font-semibold dark:text-white">
          No Clinical Explanation Available
        </h3>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Upload an image to generate an AI medical explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {Object.entries(data).map(([title, value]) => (

        <div
          key={title}
          className="
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-700
          bg-slate-50
          dark:bg-slate-800
          p-6
          transition
          hover:shadow-lg
          "
        >

          <div className="flex items-center gap-4 mb-5">

            <div
              className={`
                rounded-xl
                p-3
                ${sectionColors[title.toLowerCase()] ||
                "bg-slate-200 dark:bg-slate-700"}
              `}
            >
              {sectionIcons[title.toLowerCase()] || (
                <FileText size={20} />
              )}
            </div>

            <h3
              className="
              text-xl
              font-bold
              capitalize
              dark:text-white
              "
            >
              {title}
            </h3>

          </div>

          <div
            className="
            leading-8
            whitespace-pre-wrap
            text-slate-700
            dark:text-slate-300
            "
          >
            {value}
          </div>

        </div>

      ))}

    </div>
  );
}