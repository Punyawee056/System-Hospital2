'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import UpcomingAppointment from '@/components/UpcomingAppointment'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4 relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 text-blue-500"
        >
          <ArrowLeft />
        </button>

        {/* User Info */}
        <div className="flex items-center flex-col mt-8">
          <img
            src="/man.png"
            alt="Avatar"
            className="w-20 h-20 rounded-full border"
          />
          <h2 className="text-lg font-bold mt-2">เทเล ทันบี้</h2>
          <p className="text-gray-500 text-sm">1234567890XXX</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-around mt-6">
          <button
            onClick={() => router.push('/appointment')}
            className="text-center"
          >
            <div className="text-blue-600 text-3xl">📅</div>
            <p className="text-sm font-semibold">นัดหมายออนไลน์</p>
          </button>

          <button
            onClick={() => router.push('/history')}
            className="text-center"
          >
            <div className="text-blue-600 text-3xl">📨</div>
            <p className="text-sm font-semibold">ประวัติการรักษา</p>
          </button>
        </div>
      </div>

      {/* นัดหมายที่จะถึง */}
      <UpcomingAppointment />

      {/* ข้อมูลผู้ใช้งาน */}
      <div className="w-full max-w-md mt-4">
        <h3 className="font-bold text-black">ข้อมูลผู้ใช้งาน</h3>
        <div className="bg-blue-600 text-white rounded-xl p-4 mt-2 space-y-2">
          <div className="bg-blue-400 p-3 rounded-md flex items-center space-x-2">
            <span>📞</span>
            <span>0987654321</span>
          </div>
          <div className="bg-blue-400 p-3 rounded-md flex items-center space-x-2">
            <span>🎂</span>
            <span>1 ม.ค. 2525</span>
          </div>
        </div>
      </div>
    </div>
  )
}
