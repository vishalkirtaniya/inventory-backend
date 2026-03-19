import { Router } from "express";
import {
  getAllProducts,
  getLowStockProducts,
  createProduct,
  updateStock,
  deleteProduct,
} from "../controllers/productController";

const productRouter = Router();

productRouter.get("/low-stock", getLowStockProducts);
productRouter.get("/", getAllProducts);
productRouter.post("/", createProduct);
productRouter.patch("/:id", updateStock);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
