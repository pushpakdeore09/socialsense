import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Grid,
  Box,
} from "@mui/material";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalysisViewModal = ({ open, onClose, analysis }) => {
  if (!analysis) return null;

  const formattedDate = new Date(analysis.date).toLocaleDateString("en-GB");

  const prediction = analysis.stage1?.prediction === 1 ? "Depressed" : "Not Depressed";
  const stage1Confidence = analysis.stage1
    ? `${(analysis.stage1.confidence * 100).toFixed(2)}%`
    : "-";

  const stage2Data = analysis.stage2
    ? Object.entries(analysis.stage2.confidence)
        .filter(([_, value]) => value > 0) 
        .map(([key, value]) => ({ label: key, value: (value * 100).toFixed(1) }))
    : [];

  const maxValue = stage2Data.length > 0 ? Math.max(...stage2Data.map((i) => i.value)) : 0;

  const chartData = {
    labels: stage2Data.map((item) => item.label.charAt(0).toUpperCase() + item.label.slice(1)),
    datasets: [
      {
        label: "Confidence (%)",
        data: stage2Data.map((item) => item.value),
        backgroundColor: stage2Data.map((item) =>
          item.value == maxValue ? "#ef4444" : "#0284c7"
        ),
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", 
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Confidence (%)" },
      },
      y: {
        title: { display: true, text: "Category" },
      },
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ fontWeight: "bold", color: "#0c4a6e" }}
      >
        Analysis Result
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0284c7", mb: 2 }}>
          Basic Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Age:</strong> {analysis.age}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Gender:</strong> {analysis.gender}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2"><strong>Date:</strong> {formattedDate}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Text Analyzed
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
          {analysis.text}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0284c7", mb: 2 }}>
          Stage 1 Result
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Prediction:</strong> {prediction}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Confidence:</strong> {stage1Confidence}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {analysis.stage2 && stage2Data.length > 0 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0284c7", mb: 2 }}>
              Stage 2 Result
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Depression Type:</strong> {analysis.stage2.depressionType}
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Confidence Graph
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#0c4a6e",
            "&:hover": { backgroundColor: "#075985" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisViewModal;