"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {emailSchema, passwordSchema} from "@/lib/zodschemas";

export const createUser = async (form: {email: string, password: string}) => {
    const userSchema = z.object({
        email: emailSchema,
        password: passwordSchema
    })

    const validationResult = userSchema.safeParse(form)

    if (!validationResult.success) {
        throw new Error("Validation failed")
    } else {
        const user = await getUserByEmail(form.email)

        if (user) throw Error(`User with email ${form.email} already exists`)

        await prisma.user.create({
            data: {
                email: form.email,
                password: form.password
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

