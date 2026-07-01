import { createContext, useState } from "react";

export const DiagnosisContext = createContext();

export function DiagnosisProvider({ children }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);

  return (
    <DiagnosisContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        prediction,
        setPrediction,
        loading,
        setLoading,
      }}
    >
      {children}
    </DiagnosisContext.Provider>
  );
}