// app/page.tsx
import ScheduleEmail from './components/ScheduleEmail'
import SendEmails from './components/SendEmails'

export default function Home() {
  return (
    <>
    <main className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8 text-black">Email Scheduler</h1>
      <ScheduleEmail />
      
    </main>
    <SendEmails />
    </>
  )
}