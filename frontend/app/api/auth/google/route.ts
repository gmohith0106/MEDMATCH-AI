import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Google OAuth is not configured in this environment.',
    },
    { status: 501 }
  );
}
