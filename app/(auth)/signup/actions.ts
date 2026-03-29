"use server";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export const createUser = async (form: {username: string, password: string}) => {
    await prisma.user.create({
        data: {
            username: form.username,
            password: form.password
        }
    })

    revalidatePath("/signup");
}