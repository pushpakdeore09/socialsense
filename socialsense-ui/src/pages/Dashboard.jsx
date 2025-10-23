import React, { useState, useRef } from "react";
import {
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
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
import toast from "react-hot-toast";
import {firstStagePrediction} from '../api/analyseApi'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const textareaRef = useRef(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }
    if (!age) {
      toast.error("Please enter age");
      return;
    }
    if (!gender) {
      toast.error("Please enter gender");
      return;
    }

    setLoading(true);

    try {
      const data = {
        "text": text,
        "age": age,
        "gender": gender,
        "age_category": "Teen Age"
      }
      const response = await firstStagePrediction(data)
      console.log(response);
      
    } catch (error) {
      console.log(error);
      
    }
    setLoading(false);
    
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
          ticks: { stepSize: 10 },
        },
      },
      plugins: { legend: { display: false } },
    };

    return (
      <div
        key={id}
        className="w-full bg-white shadow-xl rounded-xl p-4 flex flex-col gap-4"
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

      <div className="flex-1 bg-gray-100 h-[calc(100vh-64px)] flex flex-col items-center">
        {/* Scrollable Results Section */}
        <div className="w-full flex-1 overflow-y-auto flex flex-col items-center py-6 px-4">
          <div className="w-full max-w-4xl flex flex-col gap-6">
            {submissions.map((submission) => renderSubmission(submission))}
          </div>
        </div>

        {/* Input Section - perfectly aligned and spaced */}
        <div className="w-full flex justify-center mb-6 px-4">
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-4 flex flex-col gap-4">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              placeholder="Type something to analyze..."
              rows={1}
              className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 chat-input"
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

            <div className="flex justify-between mt-4 items-center flex-wrap gap-4">
              <div className="flex gap-4">
                <FormControl variant="outlined" size="small" className="w-32">
                  <InputLabel>Age</InputLabel>
                  <Select
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    label="Age"
                    disabled={loading}
                  >
                    <MenuItem value={13}>13</MenuItem>
                    <MenuItem value={14}>14</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={17}>17</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" className="w-32">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Gender"
                    disabled={loading}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </div>

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
      </div>
    </>
  );
};

export default Dashboard;
