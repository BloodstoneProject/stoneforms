import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // For demo purposes, just redirect to dashboard
  // Real authentication will be added when Supabase is connected
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
