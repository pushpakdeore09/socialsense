import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    prediction: {
      type: Number,
      enum: [1, 0],
      required: true,
    },
    depressionType: {
      type: String,
      enum: [
        "Suicidal",
        "Anxiety",
        "Bipolar",
        "Stress",
        "Personality Disorder",
        "None",
      ],
      default: "None",
    },
    confidence: {
      suicidal: { type: Number, default: 0 },
      anxiety: { type: Number, default: 0 },
      bipolar: { type: Number, default: 0 },
      stress: { type: Number, default: 0 },
      personalityDisorder: { type: Number, default: 0 },
      none: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;