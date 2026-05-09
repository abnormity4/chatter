import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {validateSession} from './src/shared/services/auth/session.service'

export async function proxy(request: NextRequest) {
    try {
        const userId: string = await validateSession();

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', userId); //TODO: move to constants

        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        });

    } catch {
        return NextResponse.redirect(new URL('/', request.url))
    }
}
  
export const config = {
  matcher: ['/channel']
}