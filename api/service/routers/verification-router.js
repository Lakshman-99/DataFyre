import express from "express";
import { verifyEmail, verifyInvitation } from "../controllers/verification-controller.js";

const verificationRouter = express.Router();

// Verify new user's email
verificationRouter.get("/verify-email", verifyEmail);

// Invite user to join as a collaborator to a application
verificationRouter.get("/invite-accept", verifyInvitation);

export default verificationRouter;
