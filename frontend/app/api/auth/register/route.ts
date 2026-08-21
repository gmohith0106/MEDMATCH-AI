import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, organization, role } = body;

    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Date.now()}`,
        name: `${firstName} ${lastName}`,
        email,
        organization: organization || 'Hospital Workspace',
        role: role || 'Procurement Manager',
      },
      message: 'Workspace registered successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
