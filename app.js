import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import EventRouter from "./routes/EventRouter.js";
import RsvpRouter from "./routes/RsvpRouter.js";
const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/event",EventRouter);
app.use("/api/v1/rsvp",RsvpRouter) ;
dbConnection();
app.use(errorMiddleware);

export default app;
