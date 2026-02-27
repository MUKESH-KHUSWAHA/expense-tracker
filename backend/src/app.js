import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import expenseRoutes from "./routes/expense.routes.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js";
import requireAuth from "./middleware/auth.middleware.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || false,
  credentials: true,
};
if (process.env.CLIENT_URL) {
  app.use(cors(corsOptions));
} else {
  app.use(cors({ credentials: true }));
}

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/users", requireAuth, userRoutes);

// Rate limiting for AI to prevent excessive costs/abuse
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1000 : 20, // High limit for dev
  message: {
    success: false,
    message: "Too many requests to AI Analytics, please try again after 15 minutes",
  },
});

app.use("/api/ai", aiLimiter, requireAuth, aiRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

export default app;