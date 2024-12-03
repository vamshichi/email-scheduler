"use client"

import { useState, FormEvent } from 'react';


export default function BulkEmailForm() { 
  const [emails, setEmails] = useState(''); 
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    setSending(true); 
    setResult(null);

    // Split, trim and filter emails
    const emailList = emails.split(',').map((email) => email.trim()).filter((email) => email !== '');

    if (emailList.length < 1 || emailList.length > 200) {
      setResult('Error: Provide between 1 and 200 email addresses.');
      setSending(false);
      return;  // Return here to stop further execution
    }

    // Define the HTML email content
    const htmlMessage = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <p>Dear Sir / Madam,</p>
          <p style="font-weight: bold;">Greetings From Maxpo Exhibitions!!</p>
          <h1 style="color: #0073e6; font: bold;">You are personally invited!</h1>
          <p> Kindly treat this as a personal invitation and join us for the inauguration and be a part of the show.</p>
          <p>Don’t miss the golden opportunity to meet the builders directly and buy your dream home in your hometown.</p>
          <img src="https://drive.google.com/uc?export=view&id=1HahyofOBlno46j6wg16VAC15I--ko9jY" alt="Event Image" style="width:100%; height:auto;" />
          <p><strong>📍 Where:</strong> Crowne Plaza Hotel, Salahuddin Road, Deira, Dubai</p>
          <p><strong>📅 When:</strong> 7th & 8th December | 10:00 AM to 8:00 PM</p>
          <p><strong>💰 Entry & Parking:</strong> FREE</p>
          <p><strong>✨ Why Visit?</strong></p>
          <ul>
            <li>Explore projects by top Indian builders.</li>
            <li>Exciting offers: Win gold coins, cars, and bikes with bookings.*</li>
            <li>Meet industry leaders and find the perfect home or investment property.</li>
          </ul>
          <p><strong>📢 Don’t miss out!</strong></p>
          <p>👉 To register, <a href="https://dubai-maxpo-exhibitions.vercel.app/visitors">click here</a> or scan the QR code in the image.</p>
          <p>For more details, feel free to call us anytime.</p>
          <p>Thanks & Regards,<br>Team Maxpo</p>
          <p>Call: 00971 561486141<br>Email: <a href="mailto:sales@maxpo.ae">sales@maxpo.ae</a><br>Website: <a href="https://www.maxpo.ae">www.maxpo.ae</a></p>
        </body>
      </html>
    `;

    try {
      const response = await fetch('/api/sendEmails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: htmlMessage, emailList }),
      });
      const data = await response.json();

      // More robust response check
      if (response.ok && data && data.sentCount !== undefined) {
        setResult(`Successfully sent ${data.sentCount} emails.`);
      } else {
        setResult('Error sending emails.');
      }
    } catch (error) {
      console.error(error);  // Log any error to the console for debugging
      setResult('Error sending emails.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
    <textarea
      value={emails}
      onChange={(e) => setEmails(e.target.value)}
      placeholder="Enter email addresses separated by commas"
      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
    />
    <button
      type="submit"
      disabled={sending}
      className={`w-full p-4 text-white font-semibold rounded-md ${sending ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300'} transition`}
    >
      {sending ? 'Sending...' : 'Send Emails'}
    </button>
    {result && (
      <p className="mt-4 text-center text-sm text-green-500">
        {result}
      </p>
    )}
  </form>
  
  );
}
