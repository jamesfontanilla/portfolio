import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname === '/') {
    return updateSession(req);
  }

  const res = NextResponse.next();
  res.headers.set('x-pathname', req.nextUrl.pathname);
  return res;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
