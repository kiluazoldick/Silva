import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Pour development sans Supabase, juste laisser tout passer
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)'],
}
