import express from "express";
import {
  sendRSVP,
  getEventRSVPs,
  confirmRSVP,
  getPendingEvents ,
  getConfirmedEvents ,
  deleteRsvp 
} from "../controller/RsvpController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/:eventId",isAuthenticated, sendRSVP); // Send RSVP
router.get("/:eventId", isAuthenticated, getEventRSVPs); // Get RSVPs for an event
router.put("/confirm/:rsvpId", isAuthenticated , confirmRSVP); // Confirm/Reject RSVP
router.get("/pending/:receiverId",isAuthenticated, getPendingEvents);
router.delete("/decline/:rsvpId" , isAuthenticated , deleteRsvp);
router.get("/confirmed/events/:receiverId" , getConfirmedEvents)
export default router;
