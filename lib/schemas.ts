import {USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "@/lib/constants";
import {z} from "zod";

export const usernameSchema = z.string()
    .min(USERNAME_MIN_LENGTH, "too_short")
    .max(USERNAME_MAX_LENGTH, "too_long")