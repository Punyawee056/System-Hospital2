"use client";

import { FiChevronLeft, FiCalendar, FiClock } from "react-icons/fi";
import { FaHospitalUser } from "react-icons/fa";
import Link from "next/link";

interface AppointmentCardProps {
  idCard: string;
  department: string;
  date: string;
  time: string;
}

const AppointmentCard = ({ idCard, department, date, time }: AppointmentCardProps) => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <Link href="/">
            <FiChevronLeft className="text-gray-600 text-2xl cursor-pointer" />
          </Link>
          <h2 className="text-xl font-bold">ใบนัด</h2>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          เลขบัตรประชาชน : {idCard}
        </p>
      </div>

      {/* Appointment Details */}
      <div className="w-full max-w-md bg-white p-4 mt-4 rounded-lg shadow-md">
        {/* แผนก */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
          <FaHospitalUser className="text-gray-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">แผนก</p>
            <p className="text-gray-800 font-semibold">{department}</p>
          </div>
        </div>

        {/* วันที่ */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg mt-3">
          <FiCalendar className="text-gray-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">วันที่</p>
            <p className="text-gray-800 font-semibold">{date}</p>
          </div>
        </div>

        {/* เวลา */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg mt-3">
          <FiClock className="text-gray-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">เวลา</p>
            <p className="text-gray-800 font-semibold">{time}</p>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      <button
        className="w-full max-w-md mt-6 p-4 bg-gray-700 text-white text-lg rounded-lg shadow-md hover:bg-gray-800"
      >
        ยกเลิกนัดหมาย
      </button>
    </div>
  );
};

export default AppointmentCard;
