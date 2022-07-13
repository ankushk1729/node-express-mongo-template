import { config } from 'dotenv'
import "express-async-errors";
import express from "express";
import { connectDB } from "./db/connect.js";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import { auth as AuthMiddleware } from "./middlewares/auth.js";
import ErrorHandlerMiddleware from "./middlewares/errorHandler.js";
import NotFoundMiddleware from "./middlewares/notFound.js";
import AuthRouter from "./routes/auth.route.js";
import ContentRouter from "./routes/contents.route.js";
import UserRouter from "./routes/users.route.js";

const app = express();

config()

// Middlewares
app.use(cors());
app.use(express.json());
app.use(xss());
app.use(helmet());

app.use("/api/auth", AuthRouter);
app.use("/api/contents", AuthMiddleware, ContentRouter);
app.use("/api/users", UserRouter);

app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
