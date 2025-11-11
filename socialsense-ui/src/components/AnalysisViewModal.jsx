import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";

const AnalysisViewModal = ({ open, onClose, analysis }) => {
  if (!analysis) return null;

  const formattedDate = new Date(analysis.date).toLocaleDateString("en-GB");
  const prediction =
    analysis.stage1?.prediction === 1 ? "Depressed" : "Not Depressed";
  const confidence = analysis.stage1
    ? `${(analysis.stage1.confidence * 100).toFixed(1)}%`
    : "-";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#0c4a6e", 
        }}
      >
        Analysis Result
      </DialogTitle>

      <DialogContent dividers>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#0284c7",
            mb: 2,
          }}
        >
          Stage 1 Result
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Text Analyzed:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
          }}
        >
          {analysis.text}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Prediction:</strong> {prediction}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Confidence:</strong> {confidence}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Date:</strong> {formattedDate}
        </Typography>

        {analysis.stage2 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#0284c7", 
                mb: 1,
              }}
            >
              Stage 2 Result
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Category:</strong> {analysis.stage2.category || "N/A"}
            </Typography>
            {analysis.stage2.details && (
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                <strong>Details:</strong> {analysis.stage2.details}
              </Typography>
            )}
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
