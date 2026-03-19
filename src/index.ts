import express from "express";
import productRouter from "./routes/products";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env["PORT"] ?? 3500;

app.use(express.json());

app.use("/products", productRouter);

//404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "route not found",
  });
});

//Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
