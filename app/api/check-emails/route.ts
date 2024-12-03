import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import * as EmailValidator from 'email-validator'
import { writeFile } from 'fs/promises'
import path from 'path'

interface Results {
  total: number;
  valid: number;
  invalid: number;
  undeliverable: number;
  downloadUrl?: string;
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      throw new Error('No file uploaded')
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    const emails = data.flat().filter((email: unknown): email is string => 
      typeof email === 'string' && email.includes('@')
    )

    const results: Results = {
      total: emails.length,
      valid: 0,
      invalid: 0,
      undeliverable: 0,
    }

    const deliverableEmails: string[] = []
    const batchSize = 100
    const totalBatches = Math.ceil(emails.length / batchSize)

    for (let i = 0; i < totalBatches; i++) {
      const batch = emails.slice(i * batchSize, (i + 1) * batchSize)
      
      batch.forEach(email => {
        const isValidSyntax = EmailValidator.validate(email)

        if (isValidSyntax) {
          // Here you would typically use an email verification service
          // For this example, we'll just use a placeholder check
          const isDeliverable = Math.random() > 0.1 // 90% chance of being deliverable

          if (isDeliverable) {
            results.valid++
            deliverableEmails.push(email)
          } else {
            results.undeliverable++
          }
        } else {
          results.invalid++
        }
      })

      // Send progress updates more frequently
      const progress = ((i + 1) / totalBatches) * 100
      await writer.write(encoder.encode(JSON.stringify({ progress: progress.toFixed(2) }) + '\n'))
    }

    // Create a new workbook with deliverable emails
    const newWorkbook = XLSX.utils.book_new()
    const newWorksheet = XLSX.utils.aoa_to_sheet([['Deliverable Emails'], ...deliverableEmails.map(email => [email])])
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Deliverable Emails')

    // Save the workbook to a file
    const fileName = `deliverable_emails_${Date.now()}.xlsx`
    const filePath = path.join(process.cwd(), 'public', fileName)
    const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'buffer' })
    await writeFile(filePath, excelBuffer)

    // Send final results with download URL
    results.downloadUrl = `/${fileName}`
    await writer.write(encoder.encode(JSON.stringify({ results }) + '\n'))
    await writer.close()

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error processing emails:', error)
    await writer.write(encoder.encode(JSON.stringify({ error: 'An error occurred while processing the file' }) + '\n'))
    await writer.close()
    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500
    })
  }
}

