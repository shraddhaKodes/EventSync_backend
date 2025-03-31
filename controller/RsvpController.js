import { RSVP } from "../models/RsvpSchema.js";
import { Event } from "../models/EventSchema.js"
import { User } from "../models/userSchema.js";
import mongoose from "mongoose";
// ✅ Send RSVP Request
export const sendRSVP = async (req, res) => {
  try {
    const { eventId } = req.params;
    const senderId = req.user.id; // Authenticated user
    const { receiverId } = req.body;
    
    console.log(eventId);
    console.log(receiverId);
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }
    
    console.log(event.privacy) ;
    // Check event privacy
    if (event.privacy == "Private") {
      return res.status(403).json({ message: "RSVP not allowed! This event is private." });
    }

    // Check if RSVP already exists
    const existingRSVP = await RSVP.findOne({ eventId, senderId, receiverId });
    if (existingRSVP) {
      return res.status(400).json({ message: "RSVP already sent!" });
    }

    // Create RSVP
    const newRSVP = await RSVP.create({ eventId, senderId, receiverId });
    res.status(201).json({ message: "RSVP request sent!", rsvp: newRSVP });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get RSVP List for an Event
export const getEventRSVPs = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find RSVPs for the event
    const rsvps = await RSVP.find({ eventId })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    res.status(200).json({ rsvps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Confirm or Reject RSVP
export const confirmRSVP = async (req, res) => {
  try {
    const { rsvpId } = req.params;
    const { confirm } = req.body;

    // Find RSVP
    const rsvp = await RSVP.findById(rsvpId);
    if (!rsvp) {
      return res.status(404).json({ message: "RSVP not found!" });
    }

    // Update RSVP status
    console.log(confirm);
    rsvp.status = confirm ? "Going" : "Not Going";
    rsvp.confirmed = confirm;
    await rsvp.save();

    res.status(200).json({
      message: `RSVP ${confirm ? "confirmed" : "declined"}!`,
      rsvp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getConfirmedEvents = async (req, res) => {
  try {
    let receiverId = req.params.receiverId.trim(); // Ensure no extra spaces/newlines
    console.log("Received receiverId:", JSON.stringify(receiverId)); // Debugging
    const confirmedRSVPs = await RSVP.find({confirmed : "true" , receiverId : receiverId})
      .populate("senderId", "fullName email") // Get sender details
      .populate("eventId", "title startDateTime ") // Get event details
      .sort({ updatedAt: -1 }); // Show latest confirmed RSVPs first

    res.status(200).json(confirmedRSVPs);
  } catch (error) {
    console.error("Error fetching confirmed RSVP requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get Pending Events
export const getPendingEvents = async (req, res) => {
  console.log("Function reached!"); // Debugging
  try {
    console.log("Entering getPendingEvents...");

    let receiverId = req.params.receiverId.trim(); // Ensure no extra spaces/newlines
    console.log("Received receiverId:", JSON.stringify(receiverId)); // Debugging

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      console.error("Invalid receiverId format:", receiverId);
      return res.status(400).json({ error: "Invalid receiverId format" });
    }
    receiverId = receiverId.trim() ;
    console.log("Trimmed receiverId:", receiverId); // Debugging
    // Convert receiverId to ObjectId
    const objectIdReceiverId = new mongoose.Types.ObjectId(receiverId);

   // Find pending RSVP requests
   const pendingRSVPs = await RSVP.find({
    receiverId: objectIdReceiverId,
    status: "Pending"
  })
  .populate("senderId", "fullName email avatar")
  .populate("eventId", "title startDateTime");

    console.log("Pending RSVPs:", pendingRSVPs);

    res.status(200).json({ rsvps: pendingRSVPs }); 
  } catch (error) {
    console.error("Error fetching pending RSVP requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteRsvp = async (req, res) => {
  try {
    const { rsvpId } = req.params;

    // Check if the RSVP exists
    const rsvp = await RSVP.findById(rsvpId);
    if (!rsvp) {
      return res.status(404).json({ success: false, message: "RSVP not found" });
    }

    // Delete the RSVP from the database
    await RSVP.findByIdAndDelete(rsvpId);

    res.status(200).json({ success: true, message: "RSVP successfully declined" });
  } catch (error) {
    console.error("Error declining RSVP:", error);
    res.status(500).json({ success: false, message: "Server error, could not decline RSVP" });
  }
};

