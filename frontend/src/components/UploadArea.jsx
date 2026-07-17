import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  ImageIcon,
  CheckCircle2,
  RefreshCcw,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UploadArea({
  onAnalyze,
  loading = false,
  setUploadedImage,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      const selected = acceptedFiles[0];

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      const url = URL.createObjectURL(selected);

      setFile(selected);
      setPreview(url);

      if (setUploadedImage) {
        setUploadedImage(selected);
      }
    },
    [preview, setUploadedImage]
  );

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setFile(null);

    if (setUploadedImage) {
      setUploadedImage(null);
    }
  };

  const handleAnalyze = () => {
    if (file && onAnalyze) {
      onAnalyze(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    onDrop,
  });

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-8">
      {/* Header */}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dermoscopic Image Upload
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Upload a high-quality dermoscopic image to generate an AI-assisted
          diagnosis.
        </p>
      </div>

      {/* Dropzone */}

      <div
        {...getRootProps()}
        className={`rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 p-10 ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        <input {...getInputProps()} />

        {!preview ? (
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-8">
              <UploadCloud size={64} className="text-blue-600" />
            </div>

            <h3 className="mt-8 text-2xl font-bold dark:text-white">
              Drag & Drop Image
            </h3>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              or click anywhere to browse
            </p>

            <div className="mt-8 flex gap-3">
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm">
                PNG
              </span>

              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm">
                JPG
              </span>

              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm">
                JPEG
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-80 w-full object-contain rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-xl"
            />

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-600" />

                <div>
                  <h4 className="font-semibold dark:text-white">
                    {file?.name}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {file && `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-xs text-slate-500">File Size</p>

                <p className="font-semibold dark:text-white">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-xs text-slate-500">File Type</p>

                <p className="font-semibold dark:text-white">
                  {file.type}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}

      <div className="mt-8 flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          disabled={!file}
          onClick={removeImage}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Choose Another Image
        </Button>

        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={!file || loading}
          onClick={handleAnalyze}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-5 w-5" />
              Analyze Skin Lesion
            </>
          )}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Supported formats: <strong>PNG, JPG, JPEG</strong>
      </p>
    </div>
  );
}