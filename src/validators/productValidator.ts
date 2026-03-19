import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),
  category_id: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
});

export const updateStockSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
