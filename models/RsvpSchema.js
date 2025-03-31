import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Going", "Not Going"],
      default: "Pending",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const RSVP = mongoose.model("RSVP", rsvpSchema);
