"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {emailSchema, passwordSchema} from "@/lib/zodschemas";
import bcrypt from "bcryptjs";

export const createUser = async (form: {email: string, password: string}) => {
    const userSchema = z.object({
        email: emailSchema,
        password: passwordSchema
    })

    const validationResult = userSchema.safeParse(form)

    if (!validationResult.success) {
        throw new Error("Validation failed")
    } else {
        const user = await getUserByEmail(validationResult.data.email);

        if (user) throw Error(`User with email ${validationResult.data.email} already exists`);

        const hash = await bcrypt.hash(validationResult.data.password, 10);

        await prisma.user.create({
            data: {
                email: validationResult.data.email,
                password: hash
            }
        })
    }
}

export const getUserByEmail = async (email: string) => {
    return prisma.user.findFirst({
        where: {email: email},
        select: {email: true}
    });
};

