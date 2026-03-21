import { Router } from "express";
import * as analysisController from "../controllers/analysis.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/save-analysis/stage-one",
  authMiddleware.authUser,
  analysisController.saveStage1AnalysisResult
);
router.get(
  "/user/:userId",
  authMiddleware.authUser,
  analysisController.getUserAnalyses
);

router.delete(
  "/delete-analysis/:analysisId",
  authMiddleware.authUser,
  analysisController.deleteUserAnalysis
);

router.get("/get-analysis/:analysisId", authMiddleware.authUser, analysisController.getAnalysisById)

router.post(
  "/save-analysis/stage-two",
  authMiddleware.authUser,
  analysisController.saveStage2AnalysisResult
);

router.post("/stage-two", analysisController.saveStageTwo)
export default router;
