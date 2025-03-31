import { Event } from "../models/EventSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
// ✅ Create Event
export const createEvent = catchAsyncErrors(async (req, res, next) => {
  const { title, description, privacy, medium, startDateTime, category } = req.body;
   // Ensure maxParticipants is a single number
   const maxParticipants = Array.isArray(req.body.maxParticipants) 
   ? Number(req.body.maxParticipants[0]) // Take only the first value
   : Number(req.body.maxParticipants);
  console.log(req.body) ;
  if (!title || !description || !privacy || !medium || !startDateTime || !category || !maxParticipants) {
    return next(new ErrorHandler("All required fields must be filled!", 400));
  }

  if (!req.files || !req.files.featureImage) {
    return next(new ErrorHandler("Feature image is required!", 400));
  }

  const { featureImage } = req.files;

  // Upload feature image to Cloudinary
  const uploadedImage = await cloudinary.uploader.upload(featureImage.tempFilePath, {
    folder: "EventSync/Events",
  });

  const newEvent = await Event.create({
    ...req.body,
    userId: req.user._id,
    featureImage: {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    },
  });

  res.status(201).json({ success: true, message: "Event created successfully!", event: newEvent });
});

// ✅ Get all events with filtering by category and medium
export const getAllEvents = catchAsyncErrors(async (req, res, next) => {
  try {
    const { category, medium } = req.query;
    
    console.log("Received Category:", category);
    console.log("Received Medium:", medium);

    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (medium) {
      if (medium === "Online") {
        filter.medium = "Online";
      } else if (medium === "In Person") {
        filter.medium = "In Person";
      }
    }

    const events = await Event.find(filter);
    
    console.log("Filtered Events:", events.length);

    res.status(200).json({ success: true, events });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch events.", 500));
  }
});
// ✅ Get Events by User
export const getUserEvents = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id; // Extracted from token
  const userEvents = await Event.find({ userId });

  if (!userEvents.length) {
    return next(new ErrorHandler("No events found for this user!", 404));
  }

  res.status(200).json({ success: true, events: userEvents });
});

// ✅ Update Event
export const updateEvent = catchAsyncErrors(async (req, res, next) => {
  const { eventId } = req.params;

  let updatedEventData = { ...req.body };

  if (req.files && req.files.featureImage) {
    // Upload new feature image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.files.featureImage.tempFilePath, {
      folder: "EventSync/Events",
    });

    updatedEventData.featureImage = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedEventData, {
    new: true,
    runValidators: true,
  });

  if (!updatedEvent) {
    return next(new ErrorHandler("Event not found!", 404));
  }

  res.status(200).json({ success: true, message: "Event updated successfully!", event: updatedEvent });
});

// ✅ Delete Event
export const deleteEvent = catchAsyncErrors(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) return next(new ErrorHandler("Event not found!", 404));

  // Delete image from Cloudinary
  await cloudinary.uploader.destroy(event.featureImage.public_id);

  await event.deleteOne();
  res.status(200).json({ success: true, message: "Event deleted successfully!" });
});

export const getEventByID = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

