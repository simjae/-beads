import { z } from "zod";

const CanvasSchema = z.object({
  tileSize: z
    .number()
    .min(1, "Tile size must be at least 1")
    .max(100, "Tile size must be at most 100"),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "File is required"),
});
