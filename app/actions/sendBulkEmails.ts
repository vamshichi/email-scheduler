import nodemailer from 'nodemailer';

interface EmailData {
  subject: string;
  headline: string;
  imageUrl: string;
  message: string;
  emailList: string[];
}

interface SendBulkEmailsResponse {
  sentCount: number;
}

export async function sendBulkEmails({ subject, headline, imageUrl, message, emailList }: EmailData): Promise<SendBulkEmailsResponse> {
  try {
    // Create a nodemailer transporter using Gmail's SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail email
        pass: process.env.EMAIL_PASS, // Your Gmail app password or regular password
      },
    });

    // Prepare the HTML email content
    const htmlMessage = `
      <h1>${headline}</h1>
      <img src="${imageUrl}" alt="Email Banner" style="max-width:100%;height:auto;" />
      <p>${message}</p>
    `;

    // Send emails to all recipients in the emailList
    const results = await Promise.all(
      emailList.map((email) =>
        transporter.sendMail({
          from: `"Bulk Sender" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          html: htmlMessage,
        })
      )
    );

    // Return a response with the count of successfully sent emails
    return { sentCount: results.length };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw new Error('Error sending bulk emails');
  }
}
