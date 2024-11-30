import BulkEmailForm from '@/app/components/BulkEmailForm'

export default function Home() {
  return (
    <main className="container mx-auto p-4 bg-blue-500">
      <h1 className="text-3xl font-bold mb-6">Bulk Email Sender (200 Recipients)</h1>
      <BulkEmailForm />
    </main>
  )
}

