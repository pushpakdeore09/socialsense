import React, { useState, useRef } from "react";
import {
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import toast from "react-hot-toast";
import {
  firstStagePrediction,
  saveStage1Analysis,
  saveStage2Analysis,
  secondStagePrediction,
} from "../api/analyseApi";
import useAuth from "../store/useAuth";
import useAnalysis from "../store/useAnalysis";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const Dashboard = () => {
  const user = useAuth((state) => state.user);
  const token = useAuth((state) => state.token);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage1Result, setStage1Result] = useState(null);
  const [stage2Result, setStage2Result] = useState(null);
  const [age_group, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [stage2Loaded, setStage2Loaded] = useState(false);
  const [stage2Loading, setStage2Loading] = useState(false);

  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const { setAnalysisId } = useAnalysis();

  const handleStage1Analysis = async () => {
    if (!text.trim()) return toast.error("Please enter some text");
    if (!age_group) return toast.error("Please select age group");
    if (!gender) return toast.error("Please select gender");
    if (!profession) return toast.error("Please select profession");
    setLoading(true);
    try {
      const data = { text, age_group, gender };

      const response = await firstStagePrediction(data);
      const analysisData = {
        userId: user?._id,
        text,
        age_group,
        gender,
        stage1: response,
        stage2: null,
      };

      const savedResponse = await saveStage1Analysis(analysisData, token);

      if (savedResponse) {
        setStage1Result(savedResponse);
        setAnalysisId(savedResponse._id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while analyzing.");
    } finally {
      setLoading(false);
    }
  };

  const handleStage2Analysis = async () => {
    try {
      setLoading(true);
      setStage2Loading(true);
      const data = {
        statement: text,
        age_group: age_group,
        gender: gender,
        profession: profession,
      };
      const response = await secondStagePrediction(data);

      const savedResponse = await saveStage2Analysis(response, token);
      console.log(savedResponse);

      if (savedResponse) {
        setStage2Result(savedResponse);
        setStage2Loaded(true);
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while analyzing.");
    } finally {
      setLoading(false);
      setStage2Loading(false);
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
    if (!stage1Result) return null;

    const isDepressed = stage1Result.stage1.prediction === 1;
    const confidencePercent = (stage1Result.stage1.confidence * 100).toFixed(2);

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
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 flex flex-col gap-6 mt-8 mb-6">
        <Typography variant="h5" className="text-gray-800 font-semibold">
          Stage 1 Result
        </Typography>

        <div className="bg-teal-50 p-3 rounded-md">
          <Typography variant="subtitle2" className="text-gray-500">
            Typed Text:
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-700 whitespace-pre-wrap"
          >
            {stage1Result.text}
          </Typography>
        </div>

        <div className="flex gap-6 text-gray-700">
          <Typography variant="body1">
            <strong>Age Group:</strong> {stage1Result.age_group}
          </Typography>
          <Typography variant="body1">
            <strong>Gender:</strong>{" "}
            {stage1Result.gender
              ? stage1Result.gender.charAt(0).toUpperCase() +
                stage1Result.gender.slice(1)
              : "N/A"}
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center mt-4">
          <Typography
            variant="h6"
            className={`font-semibold ${isDepressed ? "text-red-600" : "text-green-600"}`}
          >
            {isDepressed ? "Depression Detected" : "No Depression Detected"}
          </Typography>

          <div className="w-48 h-48 mt-4">
            <Pie data={pieData} options={pieOptions} />
          </div>

          <Typography variant="body1" className="mt-2 text-gray-700">
            Confidence: {confidencePercent}%
          </Typography>

          {isDepressed && !stage2Loaded && !stage2Loading && (
            <div className="w-full flex justify-center mt-12">
              <Button
                variant="contained"
                onClick={handleStage2Analysis}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md shadow-md"
              >
                Proceed to Stage 2 Analysis
              </Button>
            </div>
          )}
        </div>

        {stage2Result && (
          <>
            <hr className="my-6 border-gray-300 w-full" />

            <Typography
              variant="h5"
              className="text-gray-800 font-semibold mt-12"
            >
              Stage 2 Result
            </Typography>

            <div className="bg-teal-50 p-4 rounded-lg">
              <Typography variant="body1" className="text-gray-700">
                Detected Type:{" "}
                <span className="font-semibold text-teal-600">
                  {stage2Result.stage2.depressionType}
                </span>
              </Typography>
            </div>

            <div className="w-full h-72 mt-6">
              <Bar
                data={{
                  labels: [
                    "Anxiety",
                    "Bipolar",
                    "Stress",
                    "Personality Disorder",
                    "Suicidal",
                  ],
                  datasets: [
                    {
                      label: "Probability",
                      data: [
                        stage2Result.stage2.confidence.anxiety,
                        stage2Result.stage2.confidence.bipolar,
                        stage2Result.stage2.confidence.stress,
                        stage2Result.stage2.confidence.personalityDisorder,
                        stage2Result.stage2.confidence.suicidal,
                      ],
                      backgroundColor: [
                        "#3B82F6",
                        "#8B5CF6",
                        "#F59E0B",
                        "#EC4899",
                        "#EF4444",
                      ],
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => context.raw.toFixed(2),
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        callback: function (val) {
                          const label = this.getLabelForValue(val);
                          return label.length > 10
                            ? label.match(/.{1,10}/g)
                            : label;
                        },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      max: 1,
                      ticks: {
                        callback: (value) => value.toFixed(2),
                      },
                    },
                  },
                }}
              />
            </div>

            {stage2Result.recommendation && (
              <div className="mt-8 bg-white shadow-lg rounded-xl p-7 border border-gray-100">
                <Typography
                  variant="h5"
                  className="text-gray-800 font-bold mb-5 flex items-center gap-2"
                >
                  Recommendations
                </Typography>

                {stage2Result.recommendation.recommendations?.length > 0 && (
                  <div className="mb-6">
                    <Typography
                      variant="h6"
                      className="text-blue-600 font-semibold mb-3"
                    >
                      Practical Tips
                    </Typography>

                    <div className="space-y-3">
                      {stage2Result.recommendation.recommendations.map(
                        (rec, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg"
                          >
                            <span className="text-blue-500 text-xl">✔</span>
                            <Typography
                              variant="body1"
                              className="text-gray-700 text-base"
                            >
                              {rec}
                            </Typography>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {stage2Result.recommendation.lifestyle_suggestions?.length >
                  0 && (
                  <div className="mb-6">
                    <Typography
                      variant="h6"
                      className="text-green-600 font-semibold mb-3"
                    >
                      Lifestyle Suggestions
                    </Typography>

                    <div className="grid md:grid-cols-2 gap-4">
                      {stage2Result.recommendation.lifestyle_suggestions.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="bg-green-50 p-4 rounded-lg flex gap-3 items-start"
                          >
                            <span className="text-green-500 text-xl">🌿</span>
                            <Typography
                              variant="body1"
                              className="text-gray-700 text-base"
                            >
                              {item}
                            </Typography>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {stage2Result.recommendation.encouraging_message && (
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-5 rounded-lg mb-6">
                    <Typography
                      variant="h6"
                      className="text-purple-700 font-semibold mb-2"
                    >
                      Encouragement
                    </Typography>

                    <Typography
                      variant="body1"
                      className="text-gray-700 italic text-lg"
                    >
                      “{stage2Result.recommendation.encouraging_message}”
                    </Typography>
                  </div>
                )}

                {stage2Result.recommendation.emergency_support && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
                    <Typography
                      variant="h6"
                      className="text-red-700 font-bold mb-2"
                    >
                      ⚠️ Emergency Support
                    </Typography>

                    <Typography
                      variant="body1"
                      className="text-gray-800 font-semibold mb-2 text-lg"
                    >
                      {stage2Result.recommendation.emergency_support.message}
                    </Typography>

                    <ul className="list-disc list-inside text-gray-800 mb-2 space-y-1 text-base">
                      {stage2Result.recommendation.emergency_support.helplines.map(
                        (line, index) => (
                          <li key={index}>{line}</li>
                        ),
                      )}
                    </ul>

                    <Typography
                      variant="body1"
                      className="text-gray-800 font-bold text-lg"
                    >
                      Emergency Number:{" "}
                      {
                        stage2Result.recommendation.emergency_support
                          .emergency_number
                      }
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <div className="flex-1 bg-gray-100 h-[calc(100vh-64px)] flex flex-col relative">
        <div
          ref={scrollRef}
          className="flex-1 w-full overflow-y-auto flex flex-col items-center justify-start px-4 mt-6 pb-24"
        >
          {renderResult()}
        </div>

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
              <div className="flex gap-4 flex-wrap">
                <FormControl variant="outlined" size="small" className="w-40">
                  <InputLabel>Age Group</InputLabel>
                  <Select
                    value={age_group}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    label="Age Group"
                    disabled={loading}
                  >
                    <MenuItem value="Adolescent">Adolescent (13-17)</MenuItem>
                    <MenuItem value="Young_Adult">Young Adult (18-30)</MenuItem>
                    <MenuItem value="Adult">Adult (31-45)</MenuItem>
                    <MenuItem value="Midlife">Midlife (46-60)</MenuItem>
                    <MenuItem value="Elderly">Elderly (60+)</MenuItem>
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

                <Autocomplete
                  freeSolo
                  options={[
                    "Student",
                    "Teacher",
                    "Engineer",
                    "Doctor",
                    "Nurse",
                    "Lawyer",
                    "Business",
                    "Artist",
                    "Unemployed",
                    "Retired",
                    "Freelancer",
                  ]}
                  value={profession}
                  onChange={(event, newValue) => setProfession(newValue)}
                  onInputChange={(event, newInputValue) =>
                    setProfession(newInputValue)
                  }
                  disabled={loading}
                  className="w-48"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Profession"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </div>

              <Button
                variant="contained"
                onClick={handleStage1Analysis}
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
