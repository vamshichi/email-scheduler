// app/api/schedule-email/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: Request) {
  const { email, subject, message, dateTime } = await request.json()

  try {
    const scheduledEmail = await prisma.scheduledEmail.create({
      data: {
        email,
        subject,
        message,
        dateTime: new Date(dateTime),
      },
    })

    // Schedule the email
    const delay = new Date(dateTime).getTime() - Date.now()
    setTimeout(() => {
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: message,
      })
    }, delay)

    return NextResponse.json({ success: true, data: scheduledEmail })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to schedule email' }, { status: 500 })
  }
}