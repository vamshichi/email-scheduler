// app/components/ScheduleEmail.tsx
'use client'

import { useState } from 'react'

export default function ScheduleEmail() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [dateTime, setDateTime] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/schedule-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, message, dateTime }),
    })

    if (response.ok) {
      alert('Email scheduled successfully!')
      setEmail('')
      setSubject('')
      setMessage('')
      setDateTime('')
    } else {
      alert('Failed to schedule email')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Recipient Email"
        required
        className="w-full px-3 py-2 text-black border rounded-md"
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
        className="w-full px-3 py-2 text-black border rounded-md"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        required
        className="w-full px-3 py-2 text-black-700 border rounded-md text-black"
      />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-md text-black"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Schedule Email
      </button>
    </form>
  )
}