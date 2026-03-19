import type { Request, Response, NextFunction } from "express";
import pool from "../db/client";
import { AppError } from "../middleware/errorHandler";
import {
  createProductSchema,
  updateStockSchema,
} from "../validators/productValidator";
import type { ProductWithCategory } from "../types/type";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await pool.query<ProductWithCategory>(`
          SELECT
            p.id,
            p.name,
            p.description,
            p.quantity,
            p.price,
            p.category_id,
            p.created_at,
            p.deleted_at,
            c.name AS category_name
          FROM products p
          JOIN categories c ON p.category_id = c.id
          WHERE p.deleted_at IS NULL
          ORDER BY p.created_at DESC
        `);

    res.status(200).json({
      status: "success",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

export const getLowStockProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const threshold = Number(req.query["threshold"] || 5);

    const result = await pool.query<ProductWithCategory>(
      `
          SELECT
            p.id,
            p.name,
            p.description,
            p.quantity,
            p.price,
            p.category_id,
            p.created_at,
            p.deleted_at,
            c.name AS category_name
          FROM products p
          JOIN categories c ON p.category_id = c.id
          WHERE p.deleted_at IS NULL
            AND p.quantity < $1
            ORDER BY p.quantity ASC
          `,
      [threshold],
    );

    res.status(200).json({
      status: "success",
      threshold,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = createProductSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues[0]?.message ?? "Validation failed",
        400,
      );
    }
    const { name, description, quantity, price, category_id } = parsed.data;

    const categoryCheck = await pool.query(
      `
            SELECT id FROM categories WHERE id = $1
            `,
      [category_id],
    );

    if (categoryCheck.rows.length == 0) {
      throw new AppError("Category not found", 404);
    }

    const result = await pool.query<ProductWithCategory>(
      `
          INSERT INTO products (name, description, quantity, price, category_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
      [name, description ?? null, quantity, price, category_id],
    );
    res.status(201).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const updateStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params["id"]);

    if (isNaN(id)) {
      throw new AppError("Invalid product ID", 400);
    }

    const parsed = updateStockSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues[0]?.message ?? "Validation failed",
        400,
      );
    }

    const { quantity } = parsed.data;

    const result = await pool.query<ProductWithCategory>(
      `
            UPDATE products
            SET quantity = $1
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING *
      `,
      [quantity, id],
    );

    if (result.rows.length === 0) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params["id"]);

    if (isNaN(id)) {
      throw new AppError("Invalid product ID", 400);
    }

    const result = await pool.query<ProductWithCategory>(
      `
            UPDATE products
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *
            `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
