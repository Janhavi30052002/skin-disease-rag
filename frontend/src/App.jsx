import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

const diseaseNames = {
  akiec: "Actinic Keratosis",
  bcc: "Basal Cell Carcinoma",
  bkl: "Benign Keratosis",
  df: "Dermatofibroma",
  mel: "Melanoma",
  nv: "Melanocytic Nevus",
  vasc: "Vascular Lesion",
};

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/explain`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error communicating with backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🩺 Skin Disease Diagnosis Assistant</h1>

      <div className="upload-card">
        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
        />

        {preview && (
          <img
            src={preview}
            alt="Uploaded lesion"
            className="preview"
          />
        )}

        <button onClick={analyzeImage}>
          Analyze Image
        </button>
      </div>

      {loading && (
        <div className="loading">
          <h2>Analyzing image...</h2>
        </div>
      )}

      {result && (
        <>
          <div className="card">
            <h2>Diagnosis</h2>

            <p
              style={{
                color:
                  result.prediction === "mel"
                    ? "#dc2626"
                    : "#16a34a",
                fontWeight: "bold",
                fontSize: "24px",
              }}
            >
              {diseaseNames[result.prediction] || result.prediction}
            </p>

            <br />

            <p>
              <strong>Confidence</strong>
            </p>

            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${result.confidence * 100}%`,
                }}
              >
                {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Clinical Explanation</h2>

            <p
              style={{
                whiteSpace: "pre-line",
              }}
            >
              {result.knowledge}
            </p>
          </div>

          <div className="card">
            <h2>Similar Retrieved Cases</h2>

            {result.similar_cases.length === 0 ? (
              <p>No similar cases found.</p>
            ) : (
              result.similar_cases.map((item, index) => (
                <div
                  className="case"
                  key={index}
                >
                  <h3>Case {index + 1}</h3>

                  <p>
                    <strong>Diagnosis:</strong>{" "}
                    {diseaseNames[item.diagnosis] ||
                      item.diagnosis}
                  </p>

                  <p>
                    <strong>Similarity:</strong>{" "}
                    {(item.score * 100).toFixed(2)}%
                  </p>

                  <p>
                    <strong>Image ID:</strong>{" "}
                    {item.image_id}
                  </p>

                  <p>
                    <strong>Lesion ID:</strong>{" "}
                    {item.lesion_id}
                  </p>

                  <p>
                    <strong>Age:</strong>{" "}
                    {item.age}
                  </p>

                  <p>
                    <strong>Sex:</strong>{" "}
                    {item.sex}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {item.localization}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}