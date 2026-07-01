import Dashboard from "./pages/Dashboard";
import { DiagnosisProvider } from "./context/DiagnosisContext";

function App() {
  return (
    <DiagnosisProvider>
      <Dashboard />
    </DiagnosisProvider>
  );
}

export default App;