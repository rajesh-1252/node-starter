import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
// db
import connectDB from "./db/connect.js";

// error middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

// route
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET)); // passing jwt secret because we are signing our cookies so the cookie can identify if the client changes the cookie

// testing route
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("hello");
});

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);
const start = async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(4000, () => {
    console.log("server listening on port 4000");
  });
};

start();
