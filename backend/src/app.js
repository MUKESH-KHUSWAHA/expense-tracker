import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expense.routes.js";
import authRoutes from "./routes/auth.routes.js";

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

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

export default app;