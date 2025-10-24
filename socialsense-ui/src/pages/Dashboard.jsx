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
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import toast from "react-hot-toast";
import { firstStagePrediction } from "../api/analyseApi";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const textareaRef = useRef(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return toast.error("Please enter some text");
    if (!age) return toast.error("Please select age");
    if (!gender) return toast.error("Please select gender");

    setLoading(true);
    try {
      const data = {
        text,
        age,
        gender,
        age_category: "Teen Age",
      };

      const response = await firstStagePrediction(data);
      console.log(response);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while analyzing.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const textarea = textareaRef.current;
    setText(e.target.value);

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const isDepressed = result.prediction === 1;
    const confidencePercent = (result.confidence * 100).toFixed(2);

    const pieData = {
      labels: ["Confidence", "Remaining"],
      datasets: [
        {
          data: [confidencePercent, 100 - confidencePercent],
          backgroundColor: isDepressed
            ? ["#EF4444", "#FCA5A5"] 
            : ["#10B981", "#A7F3D0"], 
          borderWidth: 1,
        },
      ],
    };

    const pieOptions = {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    };

    return (
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 flex flex-col gap-6 mt-8 mb-28">
        <Typography variant="h5" className="text-gray-800 font-semibold">
          Stage 1 Result
        </Typography>

        {/* Typed Text */}
        <div className="bg-teal-50 p-3 rounded-md">
          <Typography variant="subtitle2" className="text-gray-500">
            Typed Text:
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-700 whitespace-pre-wrap"
          >
            {text}
          </Typography>
        </div>

        {/* Age and Gender */}
        <div className="flex gap-6 text-gray-700">
          <Typography variant="body1">
            <strong>Age:</strong> {age}
          </Typography>
          <Typography variant="body1">
            <strong>Gender:</strong>{" "}
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </Typography>
        </div>

        {/* Prediction */}
        <div className="flex flex-col items-center justify-center mt-4">
          <Typography
            variant="h6"
            className={`font-semibold ${
              isDepressed ? "text-red-600" : "text-green-600"
            }`}
          >
            {isDepressed ? "Depression Detected" : "No Depression Detected"}
          </Typography>

          <div className="w-48 h-48 mt-4">
            <Pie data={pieData} options={pieOptions} />
          </div>

          <Typography variant="body1" className="mt-2 text-gray-700">
            Confidence: {confidencePercent}%
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <div className="flex-1 bg-gray-100 h-[calc(100vh-64px)] flex flex-col items-center relative">
        {/* Results Section */}
        <div className="flex-1 w-full overflow-y-auto flex flex-col items-center px-4 mt-6 pb-48">
          {renderResult()}
        </div>

        {/* Input Section (sticky at bottom with gap) */}
        <div className="w-full flex justify-center px-4 sticky bottom-4 z-10">
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-4 flex flex-col gap-4">
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
