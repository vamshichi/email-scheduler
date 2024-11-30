'use client';

import { useState, FormEvent } from 'react';

interface EmailData {
  subject: string;
  headline: string;
  imageUrl: string;
  message: string;
  emailList: string[];
}

export default function BulkEmailForm() {
  const [subject, setSubject] = useState('');
  const [headline, setHeadline] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [emails, setEmails] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    const emailList = emails.split(',').map((email) => email.trim()).filter((email) => email !== '');

    if (emailList.length < 1 || emailList.length > 200) {
      setResult('Error: Provide between 1 and 200 email addresses.');
      setSending(false);
      return;
    }

    try {
      const response = await fetch('/api/sendEmails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, headline, imageUrl, message, emailList }),
      });
      const data = await response.json();

      if (response.ok) {
        setResult(`Successfully sent ${data.sentCount} emails.`);
      } else {
        setResult('Error sending emails.');
      }
    } catch (error) {
      setResult('Error sending emails.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Bulk Email Sender</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter subject"
            required
          />
        </div>

        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Headline</label>
          <input
            type="text"
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter headline"
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter image URL"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your message"
            required
          />
        </div>

        <div>
          <label htmlFor="emails" className="block text-sm font-medium text-gray-700">Email Addresses</label>
          <textarea
            id="emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            rows={6}
            className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter comma-separated email addresses"
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send Bulk Emails'}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-lg text-center ${result.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  );
}
