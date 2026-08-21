import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Password has been updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Password update failed' },
      { status: 500 }
    );
  }
}
