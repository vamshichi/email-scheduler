import nodemailer from 'nodemailer';

interface EmailData {
  message: string;
  emailList: string[];
}

interface SendBulkEmailsResponse {
  sentCount: number;
}

export async function sendBulkEmails({
  message,
  emailList,
}: EmailData): Promise<SendBulkEmailsResponse> {
  try {
    // Create a nodemailer transporter using Gmail's SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail email
        pass: process.env.EMAIL_PASS, // Your Gmail app password or regular password
      },
    });

    // Send emails to all recipients in the emailList
    const results = await Promise.all(
      emailList.map((email) =>
        transporter.sendMail({
          from: `"India Property Show" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Event Invitation from Maxpo Exhibitions',
          html: message, // Use the provided HTML message
        })
      )
    );

    // Return a response with the count of successfully sent emails
    return { sentCount: results.length };
  } catch (error) {
    console.error('Error sending emails:', error);

    // Detailed error handling
    if (error instanceof Error) {
      throw new Error(`Error sending bulk emails: ${error.message}`);
    } else {
      throw new Error('Error sending bulk emails');
    }
  }
}
