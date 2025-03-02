"use client";

import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";

const MedicalHistoryPage = () => {
  const patientInfo = {
    name: "ปุณณวีร์ นามสกุล : พร้อมมูล",
    age: 21,
    bloodType: "B",
    chronicDisease: "-",
  };

  const historyData = [
    {
      year: 2567,
      months: [
        {
          month: "ตุลาคม",
          records: [
            {
              date: 20,
              department: "ตรวจโรคทั่วไป",
              diagnosis: "Urticaria - Allergic urticaria",
              patientType: "ผู้ป่วยนอก",
            },
          ],
        },
        {
          month: "มิถุนายน",
          records: [
            {
              date: 25,
              department: "อายุรกรรม",
              diagnosis: "Non-Gonococcal urethritis",
              patientType: "ผู้ป่วยนอก",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <FiChevronLeft className="text-gray-600 text-2xl cursor-pointer" />
        </Link>
        <h2 className="text-xl font-bold">ประวัติการรักษา</h2>
      </div>

      {/* Patient Info */}
      <p className="text-gray-700 mt-2 text-sm">
        ชื่อ : {patientInfo.name} อายุ : {patientInfo.age} หมู่เลือด : {patientInfo.bloodType} โรคประจำตัว : {patientInfo.chronicDisease}
      </p>

      {/* Medical History */}
      {historyData.map((yearData, index) => (
        <div key={index} className="mt-4">
          <h3 className="text-lg font-bold">{yearData.year}</h3>
          {yearData.months.map((monthData, monthIndex) => (
            <div key={monthIndex} className="mt-2 border-t pt-2">
              <h4 className="text-md font-semibold text-gray-700">{monthData.month}</h4>
              {monthData.records.map((record, recordIndex) => (
                <div key={recordIndex} className="mt-2 p-2 bg-gray-100 rounded-lg">
                  <p className="text-gray-800">วันที่ {record.date}</p>
                  <p className="text-gray-700 text-sm">แผนก : {record.department}</p>
                  <p className="text-gray-600 text-sm">{record.diagnosis}</p>
                  <p className="text-gray-500 text-sm">{record.patientType}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MedicalHistoryPage;
