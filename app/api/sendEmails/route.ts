import { NextResponse } from 'next/server';
import { sendBulkEmails } from '@/app/actions/sendBulkEmails';

type EmailData = { 
  subject: string;
  imageUrl: string;
  message: string;
  emailList: string[];
};

export async function POST(request: Request) {
  try {
    const body: EmailData = await request.json();
    const { message, emailList } = body;

    // Ensure that the request body has a valid emailList
    if (!Array.isArray(emailList) || emailList.length === 0) {
      return NextResponse.json(
        { error: 'Email list cannot be empty.' },
        { status: 400 }
      );
    }

    // Proceed with sending emails
    const response = await sendBulkEmails({ message, emailList });

    // Return a success response with the count of emails sent
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    // Log the error
    if (error instanceof Error) {
      console.error('Error in sendEmails API:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    // Send response back to the client
    return NextResponse.json(
      { error: 'Failed to send emails. Please try again later.' },
      { status: 500 }
    );
  }
}
