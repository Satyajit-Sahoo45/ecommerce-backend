import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import userRouter from "./router/user.route";
import { ErrorMiddleware } from "./middleware/error";
import productRouter from "./router/product.route";
import cartRouter from "./router/cart.route";

const app: Application = express();

// Middleware
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "../", "public")));

// Routes
app.use("/api/v1", userRouter, productRouter, cartRouter);

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use(ErrorMiddleware);

export default app;
