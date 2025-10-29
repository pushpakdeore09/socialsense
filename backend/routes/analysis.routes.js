import { Router } from "express";
import * as analysisController from "../controllers/analysis.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/save-analysis",
  authMiddleware.authUser,
  analysisController.saveAnalysisResult
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

export default router;
