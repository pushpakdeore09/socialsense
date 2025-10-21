import React, { useState, useRef } from "react";
import { Button, Typography } from "@mui/material";
import NavBar from "../components/NavBar";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const textareaRef = useRef(null);

  const handleAnalyze = () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    setLoading(true);
    const submissionId = Date.now();
    setSubmissions((prev) => [
      ...prev,
      { id: submissionId, userText: text, result: null, loading: true },
    ]);

    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; 
    }

    setTimeout(() => {
      const analysisData = {
        depression: 60.9,
        semanticAnalysis: 59.9,
        writingStyle: 63.5,
        psychological: 70.5,
        metaLearner: 60.9,
      };

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId
            ? { ...sub, result: analysisData, loading: false }
            : sub
        )
      );
      setLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    const textarea = textareaRef.current;
    setText(e.target.value);

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const renderSubmission = (submission) => {
    const { id, userText, result, loading } = submission;

    const chartData = result && {
      labels: [
        "Depression",
        "Semantic Analysis",
        "Writing Style",
        "Psychological",
        "Meta-Learner",
      ],
      datasets: [
        {
          label: "Score (%)",
          data: [
            result.depression,
            result.semanticAnalysis,
            result.writingStyle,
            result.psychological,
            result.metaLearner,
          ],
          backgroundColor: [
            "#EF4444",
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#6366F1",
          ],
          borderRadius: 6,
          barThickness: 30,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    return (
      <div
        key={id}
        className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-4 flex flex-col gap-4 mb-6"
      >
        <div className="bg-teal-100 text-teal-900 p-3 rounded-md whitespace-pre-wrap">
          <Typography variant="body1">{userText}</Typography>
        </div>

        {loading && (
          <Typography variant="body2" color="textSecondary" className="italic">
            Analyzing...
          </Typography>
        )}

        {result && (
          <>
            <Typography variant="h6" className="text-red-500">
             Depression Detected
            </Typography>

            <div className="flex justify-between">
              <Typography variant="body1" className="text-gray-600">
                Confidence Score:
              </Typography>
              <Typography variant="body1" className="text-teal-500">
                {result.depression}%
              </Typography>
            </div>

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

            <div className="w-full mt-6">
              <Typography variant="h6" className="mb-4 text-gray-700">
                Analysis Breakdown (Bar Graph)
              </Typography>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <NavBar />

      <div className="flex-1 bg-gray-100 px-4 h-[calc(100vh-64px)] flex flex-col">
        <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-4">
          {submissions.map((submission) => renderSubmission(submission))}
        </div>

        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-4 flex flex-col mb-6 gap-4 sticky bottom-0 z-10">
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
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            disabled={loading}
          />

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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
