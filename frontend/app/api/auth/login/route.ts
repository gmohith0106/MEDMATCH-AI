import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: 'usr-001',
        email,
        name: 'Dr. MOHITH RAJU',
        role: 'Procurement Manager',
        organization: 'CityCare General Hospital',
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 500 }
    );
  }
}
