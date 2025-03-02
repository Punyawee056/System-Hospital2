//หน้าการนัดหมาย

"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiChevronLeft, FiCalendar } from "react-icons/fi";
import Link from "next/link";

const AppointmentPage = () => {
  const [department, setDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const availableTimes = [
    { time: "09:00 - 09:45", available: true },
    { time: "10:00 - 10:45", available: true },
    { time: "13:00 - 13:45", available: true },
    { time: "14:00 - 14:45", available: true },
  ];

  // ✅ ฟังก์ชันบันทึกข้อมูลไปที่ MySQL ผ่าน API
  const handleSubmit = async () => {
    if (!department || !selectedDate || !selectedTime) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/appointment", {  // เปลี่ยน API เป็น /api/appointment
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        department,
        date: selectedDate.toISOString(),
        time: selectedTime,
      }),
    });
    

    if (response.ok) {
      alert("บันทึกการนัดหมายสำเร็จ!");
    } else {
      alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกการนัดหมายได้");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <Link href="/">
            <FiChevronLeft className="text-gray-600 text-2xl cursor-pointer" />
          </Link>
          <h2 className="text-xl font-bold">นัดหมายออนไลน์</h2>
        </div>
        <p className="text-gray-500 text-sm mt-2">กรุณากรอกข้อมูลให้ครบถ้วน เพื่อทำการจองคิว</p>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md bg-white p-4 mt-4 rounded-lg shadow-md">
        <label className="block text-gray-700 font-medium">แผนก</label>
        <select
          className="w-full p-3 border rounded-lg mt-2"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">เลือกแผนก</option>
          <option value="ทั่วไป">ตรวจทั่วไป</option>
          <option value="ทันตกรรม">ทันตกรรม</option>
          <option value="กายภาพบำบัด">กายภาพบำบัด</option>
        </select>

        {/* เลือกวันที่ */}
        <label className="block text-gray-700 font-medium mt-4">วันที่</label>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-3 border rounded-lg mt-2"
            placeholderText="เลือกวันที่"
          />
          <FiCalendar className="absolute top-4 right-3 text-gray-500 text-xl" />
        </div>

        {/* เลือกเวลา */}
        <label className="block text-gray-700 font-medium mt-4">เวลา</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {availableTimes.map((slot, index) => (
            <button
              key={index}
              className={`p-3 rounded-lg text-center border ${
                selectedTime === slot.time ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
              onClick={() => setSelectedTime(slot.time)}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleSubmit}
        className="w-full max-w-md mt-6 p-4 bg-gray-700 text-white text-lg rounded-lg shadow-md hover:bg-gray-800"
        disabled={loading}
      >
        {loading ? "กำลังบันทึก..." : "นัดหมายออนไลน์"}
      </button>
    </div>
  );
};

export default AppointmentPage;
