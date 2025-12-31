import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isLoginPage = path === '/admin/login'
  const isAdminPath = path.startsWith('/admin')

  const token = request.cookies.get('admin_token')?.value || ''

  if (isAdminPath && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}