import { NextResponse } from 'next/server'
import { IS_PREVIEW_MODE, SITE_BASE_PATH } from './config/index.mjs'

/** @typedef {import('next/server').NextRequest} NextRequest */

/**
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export function middleware(request) {
  if (IS_PREVIEW_MODE && request.nextUrl.pathname.startsWith('/images-next')) {
    // applied SITE_BASE_PATH to images under /public folder when server in preview mode
    return NextResponse.rewrite(
      new URL(`${SITE_BASE_PATH}${request.nextUrl.pathname}`, request.url)
    )
  } else {
    return NextResponse.next()
  }
}
