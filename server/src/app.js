import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import seasonRoutes from "./routes/seasonRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(compression());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "VPL Backend Running 🚀",
  });
});

app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/players", playerRoutes);
app.use("/api/v1/owners", ownerRoutes);
app.use("/api/v1/seasons", seasonRoutes);
app.use("/api/v1/auctions", auctionRoutes);
app.use("/api/v1/admins", adminRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
