"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Archive, ArrowLeft } from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        aria-label="ย้อนกลับ"
      >
        <ArrowLeft className="w-6 h-6 text-blue-900" />
      </button>

      {/* Hospital Logo */}
      <Image
        src="/24.png"
        alt="โรงพยาบาลแม่จัน"
        width={220}
        height={80}
        className="mb-10"
        priority
      />

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-12 text-center tracking-wide">
        ระบบบริการออนไลน์
      </h1>

      {/* Menu Buttons */}
      <div className="w-full max-w-lg space-y-8">
        {/* Appointment Button */}
        <Link href="/appointment">
          <div className="p-6 sm:p-8 flex items-center gap-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-50 hover:border-blue-300 hover:scale-105">
            <Calendar className="w-12 h-12 text-blue-700" />
            <span className="text-2xl sm:text-3xl font-semibold text-blue-900">
              นัดหมายออนไลน์
            </span>
          </div>
        </Link>

        {/* History Button */}
        <Link href="/history">
          <div className="p-6 sm:p-8 flex items-center gap-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-50 hover:border-blue-300 hover:scale-105">
            <Archive className="w-12 h-12 text-blue-700" />
            <span className="text-2xl sm:text-3xl font-semibold text-blue-900">
              ประวัติการรักษา
            </span>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-sm sm:text-base">
        © 2025 โรงพยาบาลแม่จัน | All Rights Reserved
      </footer>
    </div>
  );
};

export default DashboardPage;