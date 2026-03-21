import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Box,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import NavBar from "../components/NavBar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { getUserAnalyses } from "../api/analyseApi";
import useAuth from "../store/useAuth";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

const StatCard = ({ value, label }) => (
  <Card
    variant="outlined"
    sx={{
      textAlign: "center",
      py: 3,
      px: 3,
      backgroundColor: "#f8fafc",
      borderRadius: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      border: "1px solid #e2e8f0",
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0288d1" }}>
        {value}
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          mt: 0.5,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </Typography>
    </CardContent>
  </Card>
);

const ChartWrapper = ({ children, title }) => (
  <Card
    variant="outlined"
    sx={{
      p: 5, 
      borderRadius: 2,
      border: "1px solid #e2e8f0",
      height: 380,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: "bold", color: "#334155", mb: 3 }}
    >
      {title}
    </Typography>

    <Box
      sx={{
        width: "100%",
        height: "100%", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "90%", height: "90%" }}>
        {React.cloneElement(children, {
          options: {
            ...(children.props.options || {}),
            responsive: true,
            maintainAspectRatio: false, 
          },
        })}
      </Box>
    </Box>
  </Card>
);
const Statistics = () => {
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchUserAnalysis = async () => {
      try {
        const response = await getUserAnalyses(user._id, token);
        setAnalysisData(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAnalysis();
  }, [token, user._id]);

  useEffect(() => {
    if (!analysisData || analysisData.length === 0) return;

    const totalAnalyses = analysisData.length;
    const depressedCount = analysisData.filter(
      (d) => d.stage1?.prediction === 1,
    ).length;
    const depressionRate = ((depressedCount / totalAnalyses) * 100).toFixed(1);

    const severityClasses = [
      "Stress",
      "Anxiety",
      "Bipolar",
      "Personality Disorder",
      "Suicidal",
    ];
    const severityCounts = {
      Stress: 0,
      Anxiety: 0,
      Bipolar: 0,
      "Personality Disorder": 0,
      Suicidal: 0,
    };
    analysisData.forEach((d) => {
      const type = d.stage2?.depressionType;
      if (type && severityCounts[type] !== undefined) severityCounts[type]++;
    });

    const mostCommonSeverity = Object.keys(severityCounts).reduce(
      (a, b) => (severityCounts[a] > severityCounts[b] ? a : b),
      "N/A",
    );

    const totalConf = analysisData.reduce(
      (sum, d) => sum + (d.stage1?.confidence || 0),
      0,
    );
    const avgConfidence = ((totalConf / totalAnalyses) * 100).toFixed(1);

    const stage1Distribution = {
      labels: ["Depressed", "Not Depressed"],
      datasets: [
        {
          data: [depressedCount, totalAnalyses - depressedCount],
          backgroundColor: ["#f87171", "#60a5fa"],
          borderWidth: 1,
        },
      ],
    };

    const stage2Distribution = {
      labels: severityClasses,
      datasets: [
        {
          data: severityClasses.map((c) => severityCounts[c]),
          backgroundColor: [
            "#fbbf24",
            "#60a5fa",
            "#a78bfa",
            "#34d399",
            "#f87171",
          ],
          borderWidth: 1,
        },
      ],
    };

    const sortedData = [...analysisData].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    const confidenceTrends = {
      labels: sortedData.map((d) =>
        new Date(d.date).toLocaleDateString("en-GB"),
      ),
      datasets: [
        {
          label: "Stage 1 Confidence %",
          data: sortedData.map((d) =>
            ((d.stage1?.confidence || 0) * 100).toFixed(1),
          ),
          borderColor: "#0288d1",
          backgroundColor: "#0288d1",
          tension: 0.3,
        },
      ],
    };

    setStats({
      totalAnalyses,
      depressionRate,
      mostCommonSeverity,
      avgConfidence,
      stage1Distribution,
      stage2Distribution,
      confidenceTrends,
    });
  }, [analysisData]);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="p-6 min-h-screen bg-gray-100">
        <div className="mx-auto max-w-6xl">
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", color: "#1e293b" }}
          >
            Analysis Statistics
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { value: stats.totalAnalyses, label: "Total Analyses" },
              {
                value: `${stats.depressionRate}%`,
                label: "Depression Detection Rate",
              },
              {
                value: stats.mostCommonSeverity,
                label: "Most Common Detected Type",
              },
              {
                value: `${stats.avgConfidence}%`,
                label: "Avg Stage 1 Confidence",
              },
            ].map((item, i) => (
              <Grid key={i} item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
                <StatCard value={item.value} label={item.label} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
              <ChartWrapper title="Stage 1 Distribution">
                <Pie data={stats.stage1Distribution} />
              </ChartWrapper>
            </Grid>
            <Grid item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
              <ChartWrapper title="Stage 2 Type Distribution">
                <Pie data={stats.stage2Distribution} />
              </ChartWrapper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
              <ChartWrapper title="Confidence Trends Over Time">
                <Line data={stats.confidenceTrends} />
              </ChartWrapper>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Statistics;
