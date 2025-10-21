import React from "react";
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
} from "@mui/material";

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
  return (
    <>
      <NavBar />
      <div className="p-6 bg-white min-h-screen">
        {/* Container to align heading and table */}
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
                {analysisData.map(
                  (
                    { date, textPreview, prediction, category, confidence },
                    index
                  ) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{ color: "#134e4a", fontWeight: "medium" }}
                      >
                        {date}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#134e4a",
                          maxWidth: 350,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={textPreview}
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
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default History;
