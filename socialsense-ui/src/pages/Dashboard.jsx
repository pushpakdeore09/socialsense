import React, { useState, useRef } from "react";
import { Button, Typography } from "@mui/material";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // State to store the analysis result
  const textareaRef = useRef(null);

  const handleAnalyze = () => {
    setLoading(true);
    setResult(null); // Reset the result before analysis starts

    setTimeout(() => {
      // Simulating a backend response with analysis data
      const analysisData = {
        depression: 60.9,
        semanticAnalysis: 59.9,
        writingStyle: 63.5,
        psychological: 70.5,
        metaLearner: 60.9,
      };

      setResult(analysisData); // Set the result after response
      setLoading(false);
    }, 1500);
  };

  // Auto-resize logic for the textarea
  const handleChange = (e) => {
    const textarea = textareaRef.current;
    setText(e.target.value);

    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Adjust to content
    }
  };

  return (
    <>
      <NavBar />

      {/* Page Container */}
      <div className="flex-1 flex flex-col justify-end bg-gray-100 px-4 overflow-hidden h-[calc(100vh-64px)]">
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-4 flex flex-col mb-6 gap-4">
          {/* Input Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            placeholder="Type something to analyze..."
            rows={1}
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
            style={{
              minHeight: "60px",
              maxHeight: "300px",
              height: "auto",
              overflow: "hidden", // Ensures no scrollbars
              whiteSpace: "pre-wrap", // Keeps newlines intact
              wordBreak: "break-word", // Avoids horizontal scrolling
            }}
          />

          {/* Analyze Button */}
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyze}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Text"}
            </Button>
          </div>

          {/* Display analysis result if available */}
          {result && (
            <div className="w-full mt-6 bg-white shadow-xl rounded-xl p-4 flex flex-col gap-4">
              {/* Depression Detection */}
              <Typography variant="h6" className="text-red-500">
                ⚠️ Depression Detected
              </Typography>
              <div className="flex justify-between">
                <Typography variant="body1" className="text-gray-600">
                  Confidence Score:
                </Typography>
                <Typography variant="body1" className="text-teal-500">
                  {result.depression}%
                </Typography>
              </div>

              {/* Results */}
              <div className="flex gap-4">
                <div className="flex-1 p-3 border border-gray-300 rounded-md">
                  <Typography variant="body2" className="text-gray-500">
                    Semantic Analysis
                  </Typography>
                  <Typography variant="body2" className="text-teal-500">
                    {result.semanticAnalysis}%
                  </Typography>
                </div>
                <div className="flex-1 p-3 border border-gray-300 rounded-md">
                  <Typography variant="body2" className="text-gray-500">
                    Writing Style
                  </Typography>
                  <Typography variant="body2" className="text-teal-500">
                    {result.writingStyle}%
                  </Typography>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="flex-1 p-3 border border-gray-300 rounded-md">
                  <Typography variant="body2" className="text-gray-500">
                    Psychological
                  </Typography>
                  <Typography variant="body2" className="text-teal-500">
                    {result.psychological}%
                  </Typography>
                </div>
                <div className="flex-1 p-3 border border-gray-300 rounded-md">
                  <Typography variant="body2" className="text-gray-500">
                    Meta-Learner
                  </Typography>
                  <Typography variant="body2" className="text-teal-500">
                    {result.metaLearner}%
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
