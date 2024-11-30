import { NextResponse } from 'next/server';
import { sendBulkEmails } from '@/app/actions/sendBulkEmails';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, headline, imageUrl, message, emailList } = body;

    const response = await sendBulkEmails({ subject, headline, imageUrl, message, emailList });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to send emails.' }, { status: 500 });
  }
}
