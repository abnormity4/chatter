import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSession } from './src/shared/services/auth/session.service'
 
export async function proxy(request: NextRequest) {
    try {
        await validateSession()
    } catch {
        return NextResponse.redirect(new URL('/', request.url))
    }
}
  
export const config = {
  matcher: ['/onboarding', '/channel']
}