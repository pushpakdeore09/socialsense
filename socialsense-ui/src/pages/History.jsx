import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import useAuth from "../store/useAuth";
import {
  getUserAnalyses,
  deleteUserAnalysis,
  getAnalysis,
} from "../api/analyseApi";
import AnalysisViewModal from '../components/AnalysisViewModal';
const analysisData = [
  {
    date: "10/21/2025",
    textPreview: "I had such a wonderful day today! The weather was ...",
    prediction: "Not Depressed",
    category: "Positive",
    confidence: "28.2%",
  },
  {
    date: "10/21/2025",
    textPreview: "I feel so empty inside lately. Nothing seems to ma...",
    prediction: "Depressed",
    category: "Negative",
    confidence: "60.9%",
  },
];

const History = () => {
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const handleDelete = async (analysisId) => {
    try {
      await deleteUserAnalysis(analysisId, token);
      setAnalysisData((prevData) =>
        prevData.filter((analysis) => analysis._id !== analysisId)
      );
    } catch (error) {
      console.error("Failed to delete analysis:", error);
    }
  };
  const handleView = async (analysisId) => {
    try {
      const response = await getAnalysis(analysisId, token);
      setSelectedAnalysis(response);
      setModalOpen(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
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
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="p-6 bg-white min-h-screen">
        <div className="mx-auto max-w-6xl">
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ color: "#0c4a6e", fontWeight: "bold", mb: 2 }}
          >
            Analysis History
          </Typography>

          <TableContainer component={Paper} sx={{ backgroundColor: "#e0f2fe" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#0284c7",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#0284c7",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Text Preview
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#0284c7",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Prediction
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#0284c7",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#0284c7",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Confidence
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#0284c7",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analysisData.map((item, index) => {
                  const formattedDate = new Date(item.date).toLocaleDateString(
                    "en-GB"
                  );

                  const prediction =
                    item.stage1?.prediction === 1
                      ? "Depressed"
                      : "Not Depressed";

                  const confidence = item.stage1
                    ? `${(item.stage1.confidence * 100).toFixed(1)}%`
                    : "-";

                  const category = item.stage2
                    ? item.stage2.category || "N/A"
                    : "-";

                  const textPreview =
                    item.text.length > 50
                      ? item.text.slice(0, 50) + "..."
                      : item.text;

                  return (
                    <TableRow key={index}>
                      <TableCell
                        sx={{ color: "#134e4a", fontWeight: "medium" }}
                      >
                        {formattedDate}
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#134e4a",
                          maxWidth: 350,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={item.text}
                      >
                        {textPreview}
                      </TableCell>

                      <TableCell
                        sx={{
                          color:
                            prediction === "Depressed" ? "#0369a1" : "#0f766e",
                          fontWeight: "bold",
                        }}
                      >
                        {prediction}
                      </TableCell>

                      <TableCell
                        sx={{ color: "#0c4a6e", fontWeight: "medium" }}
                      >
                        {category}
                      </TableCell>

                      <TableCell sx={{ color: "#134e4a" }}>
                        {confidence}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            mr: 1,
                            textTransform: "none",
                            backgroundColor: "#0f766e",
                            "&:hover": { backgroundColor: "#115e59" },
                          }}
                          onClick={() => handleView(item._id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            textTransform: "none",
                            backgroundColor: "#0284c7",
                            "&:hover": { backgroundColor: "#0369a1" },
                          }}
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AnalysisViewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        analysis={selectedAnalysis}
      />
    </>
  );
};

export default History;
