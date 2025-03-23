"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiCalendar, FiClock, FiTrash2 } from "react-icons/fi";
import { FaHospitalUser } from "react-icons/fa";
import Link from "next/link";

interface Appointment {
  id: number;
  department: string;
  date: string;
  time: string;
}

const AppointmentPage = () => {
  const router = useRouter();
  const [citizenId, setCitizenId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCitizenId = localStorage.getItem("citizenId");
    if (storedCitizenId) {
      setCitizenId(storedCitizenId);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (citizenId) {
      fetchAppointments();
    }
  }, [citizenId]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`/api/appointment?citizenId=${citizenId}`);
      const data = await res.json();

      if (res.ok) {
        setAppointments(data);
      } else {
        console.error("❌ ไม่พบข้อมูลนัดหมาย", data.error);
      }
    } catch (error) {
      console.error("🚨 Error fetching appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    const confirmCancel = confirm("คุณต้องการยกเลิกนัดหมายนี้หรือไม่?");
    if (!confirmCancel) return;

    try {
      const response = await fetch(`/api/appointment?id=${appointmentId}&citizenId=${citizenId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ ยกเลิกการนัดหมายสำเร็จ!");
        setAppointments(appointments.filter((a) => a.id !== appointmentId));
      } else {
        alert("❌ เกิดข้อผิดพลาด ไม่สามารถยกเลิกการนัดหมายได้");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("❌ เกิดข้อผิดพลาด ไม่สามารถยกเลิกการนัดหมายได้");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex items-center gap-4 mb-8">
          <Link href="/appointment" className="text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105">
            <FiChevronLeft className="text-3xl sm:text-4xl" />
          </Link>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide">รายการนัดหมาย</h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-black text-xl sm:text-2xl md:text-3xl font-medium">
            ⏳ กำลังโหลดข้อมูล...
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-red-600 text-xl sm:text-2xl md:text-3xl font-semibold">
            ❌ ไม่พบใบนัด กรุณานัดใหม่
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              {/* Citizen ID */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium mb-6">
                🆔 เลขบัตรประชาชน: <span className="text-black font-semibold">{citizenId}</span>
              </p>

              {/* Department */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4 border border-gray-200">
                <FaHospitalUser className="text-blue-700 text-2xl md:text-3xl" />
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black">
                  {appointment.department}
                </p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4 border border-gray-200">
                <FiCalendar className="text-blue-700 text-2xl md:text-3xl" />
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black">
                  {new Date(appointment.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Time */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-200">
                <FiClock className="text-blue-700 text-2xl md:text-3xl" />
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-black">
                  {appointment.time}
                </p>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => handleCancel(appointment.id)}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-800 text-white text-lg sm:text-xl md:text-2xl font-semibold rounded-xl shadow-md flex items-center justify-center gap-3 hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <FiTrash2 className="text-xl sm:text-2xl md:text-3xl" /> ยกเลิกนัดหมาย
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;