"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {emailSchema, passwordSchema} from "@/lib/zodschemas";
import bcrypt from "bcryptjs";
import { Prisma } from "@/prisma/generated/prisma/client";


export const createUser = async (form: {email: string, password: string}) => {
    const userSchema = z.object({
        email: emailSchema,
        password: passwordSchema
    })

    const validationResult = userSchema.safeParse(form)

    if (!validationResult.success) {
        throw new Error(validationResult.error.message)
    }

    const hash = await bcrypt.hash(validationResult.data.password, 10);
    const displayName = validationResult.data.email.split("@")[0];

    try {
        await prisma.user.create({
            data: {
                email: validationResult.data.email,
                password: hash,
                displayName: displayName
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                throw new Error("An account with this email already exists.");
            }
        }
    }
}

export const checkEmailAvailability = async (email: string) => {
    return prisma.user.findUnique({
        where: {email: email},
        select: {email: true}
    });
};
