import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadArea({
  onAnalyze,
  loading = false,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;

    const selectedFile = acceptedFiles[0];

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
    onDrop,
  });

  const handleAnalyze = () => {
    if (!file) return;

    if (onAnalyze) {
      onAnalyze(file);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg h-full">

      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        Upload Dermoscopic Image
      </h2>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300

        ${
          isDragActive
            ? "border-blue-600 bg-blue-50"
            : "border-slate-300 hover:border-blue-500 hover:bg-slate-50"
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-80 rounded-xl shadow-lg"
            />

            <div className="flex justify-center items-center gap-2 text-green-600">
              <CheckCircle2 size={20} />

              <span className="font-medium">
                {file?.name}
              </span>
            </div>
          </div>
        ) : (
          <>
            <UploadCloud
              className="mx-auto mb-5 text-blue-600"
              size={60}
            />

            <h3 className="text-xl font-semibold">
              Drag & Drop Image
            </h3>

            <p className="mt-2 text-slate-500">
              or click to browse files
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Supported formats: PNG • JPG • JPEG
            </p>
          </>
        )}
      </div>

      <Button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
        disabled={!file || loading}
        onClick={handleAnalyze}
      >
        <ImageIcon className="mr-2 h-5 w-5" />

        {loading ? "Analyzing..." : "Analyze Image"}
      </Button>

      {file && (
        <p className="mt-4 text-center text-sm text-slate-500">
          Selected file:{" "}
          <span className="font-semibold">
            {file.name}
          </span>
        </p>
      )}
    </div>
  );
}