import { z } from "zod";
import { AGEGROUP, SERVICES } from "../types/enums";

export const clientSchema = z.object({
  uuid: z.string(), //auto-generated firebase
  name: z.string(),
  ethnicity: z.string(),
  ageGroup: z.nativeEnum(AGEGROUP),
  benefits: z.record(z.nativeEnum(SERVICES), z.number()),
  createdAt: z.string().optional(), //firebase
  updatedAt: z.string().optional(), //firebase
  // journeys: z.object({
  //   housingSecure: z.boolean(),
  //   housingEnrollment: z.boolean(),
  //   notes: z.string().optional(),
  // }),
  stayDuration: z
    .object({
      start: z.string(),
      end: z.string().optional(),
    })
    .optional(),
});

export type DataTable = z.infer<typeof clientSchema>;
