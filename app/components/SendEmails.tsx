
'use client'
// components/SendEmails.tsx

import React, { useState } from 'react';

const SendEmails = () => {
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file as Blob);
    formData.append('subject', subject);
    formData.append('text', text);

    try {
      const res = await fetch('/api/sendEmails', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.status === 200) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message || 'Failed to send emails');
      }
    } catch (error) {
      setErrorMessage('Failed to send emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='text-black'>
      <h2>Send Invitation Emails</h2>
      <form onSubmit={handleSubmit}  className='text-black'>
        <div className='text-black'>
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className='text-black'
          />
        </div>
        <div>
          <label>Message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Emails'}
        </button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default SendEmails;
