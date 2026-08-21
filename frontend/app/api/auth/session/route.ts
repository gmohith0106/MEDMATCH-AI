import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    authenticated: true,
    user: {
      id: 'usr-001',
      name: 'Dr. Robert Reynolds',
      email: 'r.reynolds@citycare.org',
      role: 'Procurement Manager',
      organization: 'CityCare General Hospital',
    },
  });
}
