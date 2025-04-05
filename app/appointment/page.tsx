"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FiChevronLeft, FiCalendar } from "react-icons/fi"
import Link from "next/link"

interface Appointment {
  id: number
  department: string
  date: string
  time: string
  status: string
}

const AppointmentPage = () => {
  const router = useRouter()
  const [citizenId, setCitizenId] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [department, setDepartment] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showAppointments, setShowAppointments] = useState(false)
  const [fetchingAppointments, setFetchingAppointments] = useState(false)
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const storedCitizenId = localStorage.getItem("citizenId")
    if (storedCitizenId) {
      setCitizenId(storedCitizenId)
    } else {
      alert("⚠ กรุณาเข้าสู่ระบบก่อนทำการนัดหมาย")
      router.push("/login")
    }

    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDepartments(data)
        } else {
          console.error("❌ departments API did not return an array:", data)
          setDepartments([])
        }
      })
      .catch((err) => {
        console.error("🚨 Error loading departments:", err)
        alert("❌ ไม่สามารถโหลดรายการแผนกได้")
        setDepartments([])
      })
  }, [router])

  useEffect(() => {
    if (!department || !selectedDate) return

    fetch("/api/available-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        department,
        date: selectedDate.toISOString().split("T")[0],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("เวลาที่ได้ไม่ถูกต้อง:", data)
          setAvailableTimes([])
          return
        }

        const times = data.map(
          (slot: any) => `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`
        )
        setAvailableTimes(times)
      })
      .catch((err) => {
        console.error("โหลดเวลาไม่สำเร็จ:", err)
        setAvailableTimes([])
      })
  }, [department, selectedDate])

  const handleSubmit = async () => {
    if (!citizenId || !fullName || !department || !selectedDate || !selectedTime) {
      alert("⚠ กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId,
          fullName,
          department,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("✅ บันทึกการนัดหมายสำเร็จ!")
        router.push(`/appointment/${data.id}`)
      } else {
        alert(`❌ เกิดข้อผิดพลาด: ${data.error || "ไม่สามารถบันทึกการนัดหมายได้"}`)
      }
    } catch (error) {
      console.error("🚨 Error submitting appointment:", error)
      alert("❌ เกิดข้อผิดพลาด ไม่สามารถบันทึกการนัดหมายได้")
    }
    setLoading(false)
  }

  const handleViewAppointments = async () => {
    if (!citizenId) {
      alert("⚠ กรุณาเข้าสู่ระบบก่อนดูใบนัด")
      router.push("/login")
      return
    }

    setFetchingAppointments(true)
    try {
      const response = await fetch(`/api/appointment?citizenId=${citizenId}`)
      const data = await response.json()
      if (response.ok) {
        setAppointments(data)
        setShowAppointments(true)
      } else {
        alert(`❌ เกิดข้อผิดพลาด: ${data.error || "ไม่สามารถดึงข้อมูลนัดหมายได้"}`)
      }
    } catch (error) {
      console.error("🚨 Error fetching appointments:", error)
      alert("❌ เกิดข้อผิดพลาด ไม่สามารถดึงข้อมูลนัดหมายได้")
    } finally {
      setFetchingAppointments(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <Link href="/login" className="text-gray-700 hover:text-blue-800 transition-all duration-300">
          <FiChevronLeft className="text-3xl md:text-4xl" />
        </Link>
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-900">
          {showAppointments ? "รายการนัดหมาย" : "นัดหมายออนไลน์"}
        </h2>
      </div>

      {!showAppointments ? (
        <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
          {/* ชื่อผู้จอง */}
          <div className="mb-6">
            <label className="block text-lg md:text-xl font-medium text-blue-900 mb-2">ชื่อผู้จอง</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="กรอกชื่อ-นามสกุล"
              className="w-full px-4 py-3 md:py-4 border rounded-lg text-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* แผนก */}
          <div className="mb-6">
            <label className="block text-lg md:text-xl font-medium text-blue-900 mb-2">เลือกแผนก</label>
            <select
              className={`w-full px-4 py-3 md:py-4 border rounded-lg text-lg bg-white transition-all duration-300
                ${department ? "text-black font-semibold border-gray-800" : "text-gray-400"}`}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" disabled>กรุณาเลือกแผนก</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* วันที่ */}
          <div className="mb-6">
            <label className="block text-lg md:text-xl font-medium text-blue-900 mb-2">เลือกวันที่</label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl md:text-2xl" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="เลือกวันที่"
                minDate={new Date()}
                className={`w-full pl-12 pr-4 py-3 md:py-4 border rounded-lg text-lg bg-white transition-all duration-300
                  ${selectedDate
                    ? "text-black font-semibold border-black"
                    : "text-gray-400 border-gray-300"
                  }`}
              />
            </div>
          </div>

          {/* เวลา */}
          <div className="mb-6">
            <label className="block text-lg md:text-xl font-medium text-blue-900 mb-2">เลือกเวลา</label>
            {availableTimes.length === 0 ? (
              <p className="text-sm text-gray-500">ไม่มีช่วงเวลาที่ว่างในวันนี้</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {availableTimes.map((time, index) => (
                  <button
                    key={index}
                    className={`py-3 md:py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                      selectedTime === time
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-blue-900 hover:bg-blue-50 border border-gray-300"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // รายการนัด
        <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
          {fetchingAppointments ? (
            <div className="text-center text-gray-600 text-lg">⏳ กำลังโหลด...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">ไม่มีนัดหมาย</div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-blue-900">แผนก: {appointment.department}</p>
                      <p className="text-gray-600">
                        วันที่: {new Date(appointment.date).toLocaleDateString("th-TH")}
                      </p>
                      <p className="text-gray-600">เวลา: {appointment.time}</p>
                      <p className={`text-sm ${appointment.status === "pending" ? "text-yellow-600" : "text-green-600"}`}>
                        สถานะ: {appointment.status === "pending" ? "รอการยืนยัน" : "ยืนยันแล้ว"}
                      </p>
                    </div>
                    <Link href={`/appointment/${appointment.id}`}>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                        ดูรายละเอียด
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ปุ่มล่าง */}
      <div className="w-full max-w-2xl mt-8 space-y-4">
        {!showAppointments ? (
          <>
            <button
              onClick={handleSubmit}
              className="w-full py-4 md:py-5 bg-blue-700 text-white text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "⏳ กำลังบันทึก..." : "✅ ยืนยันการนัดหมาย"}
            </button>
            <button
              onClick={handleViewAppointments}
              className="w-full py-4 md:py-5 bg-green-600 text-white text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300"
            >
              📅 ดูใบนัด
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowAppointments(false)}
            className="w-full py-4 md:py-5 bg-blue-700 text-white text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300"
          >
            กลับไปนัดหมาย
          </button>
        )}
      </div>
    </div>
  )
}

export default AppointmentPage
