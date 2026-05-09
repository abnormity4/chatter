'use server'

import prisma from "@/lib/prisma"
import { validateSession } from "@/src/shared/services/auth/session.service"

export async function completeOnboarding({ displayName, avatar, isOnboarded }: { displayName: string, avatar: string, isOnboarded: boolean }) {
    
    const userId = await validateSession()
    
    await prisma.user.update({
        where: { id: userId },
        data: {
            displayName,
            avatar,
            isOnboarded
        }
    })
}