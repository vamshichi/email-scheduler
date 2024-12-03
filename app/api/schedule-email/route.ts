import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  const { email, subject, message, dateTime } = await request.json();

  try {
    const scheduledEmail = await prisma.scheduledEmail.create({
      data: {
        email,
        subject,
        message,
        dateTime: new Date(dateTime),
      },
    });

    return NextResponse.json({ success: true, data: scheduledEmail });
  } catch (error) {
    console.error('Error in scheduling email:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to schedule email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

