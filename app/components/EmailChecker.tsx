'use client'

import { useState, useCallback } from 'react'

interface EmailCheckResults {
  total: number;
  valid: number;
  invalid: number;
  undeliverable: number;
  downloadUrl?: string;
}

export default function EmailChecker() {
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<EmailCheckResults | null>(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError(null)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setResults(null)
    setDownloadUrl(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/check-emails', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Server error occurred')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          const data = JSON.parse(line)
          if (data.progress) {
            setProgress(parseFloat(data.progress))
          } else if (data.results) {
            setResults(data.results)
            if (data.results.downloadUrl) {
              setDownloadUrl(data.results.downloadUrl)
            }
          } else if (data.error) {
            throw new Error(data.error)
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while processing the file')
    } finally {
      setIsProcessing(false)
    }
  }, [file])

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={!file || isProcessing}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          {isProcessing ? 'Processing...' : 'Check Emails'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isProcessing && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
              style={{ width: `${progress}%` }}
            >
              {progress.toFixed(2)}%
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Processing: {progress.toFixed(2)}%</p>
        </div>
      )}

      {results && (
        <div className="border border-gray-300 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <p>Total emails: {results.total}</p>
          <p>Valid emails: {results.valid}</p>
          <p>Invalid emails: {results.invalid}</p>
          <p>Undeliverable emails: {results.undeliverable}</p>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="deliverable_emails.xlsx"
              className="block mt-4 bg-green-500 text-white p-2 rounded text-center"
            >
              Download Deliverable Emails
            </a>
          )}
        </div>
      )}
    </div>
  )
}
