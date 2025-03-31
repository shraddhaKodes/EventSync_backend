import express from "express";
import { createEvent, getAllEvents, getUserEvents, updateEvent, deleteEvent ,getEventByID } from "../controller/EventController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createEvent);
router.get("/getall", getAllEvents);
router.get("/my_events", isAuthenticated, getUserEvents);
router.put("/update/:eventId", isAuthenticated, updateEvent);
router.get("/:eventId",  getEventByID);
router.delete("/delete/:eventId", isAuthenticated, deleteEvent);

export default router;
