import { NextResponse } from 'next/server'
import { URL_MIRROR_MEDIA } from './config'

export function middleware(req) {
  console.log(
    JSON.stringify({
      severity: 'DEBUG',
      message: `redirect to mirror media with invalid path ${req.url}`,
    })
  )
  return NextResponse.redirect(URL_MIRROR_MEDIA + req.nextUrl.pathname)
}

// since there is only search page, redirect other pages back to mirror media
export const config = {
  matcher: [
    '/search',
    '/((?!api|static|favicon.ico|_next|images|sw|search/).*)',
  ],
}
