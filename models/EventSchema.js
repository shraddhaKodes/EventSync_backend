import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Reference to User model
      required: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required!"],
      minLength: [3, "Title must contain at least 3 characters!"],
    },
    description: {
      type: String,
      required: [true, "Event description is required!"],
    },
    privacy: {
      type: String,
      enum: ["Public", "Private"],
      required: [true, "Privacy setting is required!"],
    },
    medium: {
      type: String,
      enum: ["All","Online", "In Person"],
      required: [true, "Event medium is required!"],
    },
    startDateTime: {
      type: Date,
      required: [true, "Start date and time is required!"],
    },
    endDateTime: {
      type: Date,
    },
    duration: {
      type: String, // Format: "hh:mm"
      validate: {
        validator: function (v) {
          return /^([0-9]{2}):([0-9]{2})$/.test(v); // hh:mm format validation
        },
        message: "Duration must be in hh:mm format!",
      },
    },
    language: {
      type: String,
      required: [true, "Language is required!"],
    },
    maxParticipants: {
      type: Number,
      min: [1, "Minimum participants must be at least 1!"],
      required: [true, "Max participants is required!"],
    },
    category: {
      type: String,
      enum: [
        "All",
        "Music",
        "Games",
        "Sports",
        "Arts",
        "Film",
        "Literature",
        "Technology",
        "Culture",
        "Lifestyle",
        "Charity",
        "Fashion",
        "Kids",
        "Other",
      ],
      required: [true, "Category is required!"],
    },
    termsAndConditions: {
      type: String,
      required: [true, "Terms and conditions are required!"],
    },
    locationName: {
      type: String,
      required: function () {
        return this.medium === "In Person";
      }, // Required only for in-person events
    },
    latitude: {
      type: Number,
      required: function () {
        return this.medium === "In Person";
      },
    },
    longitude: {
      type: Number,
      required: function () {
        return this.medium === "In Person";
      },
    },
    acceptingRSVPs: {
      type: Boolean,
      default: true,
    },
    featureImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
