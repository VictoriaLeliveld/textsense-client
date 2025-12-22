import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);


  const handleAnalyze = async () => {
    setLoading(true);  // start loading
    setResult("");

    try {
      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      // handle Gemini's array response or string
      setResult(
        typeof data.result === "string"
          ? data.result
          : data.result?.parts?.map((p) => p.text).join("\n\n") || "No result"
      );
    } catch (err) {
      console.error(err);
      setResult("Error analyzing text");
    }
      setLoading(false); // done
  };

  return (
    <div className="App">
      <h1>TextSense</h1>
      <p className="description">
        Analyze web content for readability and accessibility, and get improvement suggestions.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text here..."
        rows={6}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Text"}
      </button>

      {(loading || result) && (
        <div className={`analysis ${(loading || result) ? "show" : ""}`}>
          <h2>Analysis Result:</h2>
          {loading ? <div className="loader"></div> : <pre>{result}</pre>}
        </div>
      )}
    </div>
  );
}

export default App;