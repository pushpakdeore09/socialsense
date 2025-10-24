import mongoose from "mongoose";

const stage1Schema = new mongoose.Schema(
  {
    prediction: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const stage2Schema = new mongoose.Schema(
  {
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
  { timestamps: true, _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    stage1: {
      type: stage1Schema,
      required: true,
    },
    stage2: {
      type: stage2Schema,
      default: null, 
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;
