import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    
    const response = await fetch(`${backendUrl}/auth/session`, {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Backend unreachable' } },
      { status: 500 }
    );
  }
}
