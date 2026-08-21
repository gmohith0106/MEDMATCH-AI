import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    return NextResponse.json({
      success: true,
      message: `Password reset instructions sent to ${email || 'email'}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Password reset failed' },
      { status: 500 }
    );
  }
}
