import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Archive } from 'lucide-react'; // นำเข้าไอคอน

const Page = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-start py-10">
      {/* โลโก้โรงพยาบาล */}
      <Image
        src="/24.png"
        alt="Maechan Hospital Logo"
        width={200}
        height={100}
        className="mb-6"
      />

      {/* ปุ่มเมนูหลัก */}
      <div className="w-full max-w-sm space-y-4">
        <Link href="/appointment">
          <div className="p-4 flex items-center gap-4 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <Calendar className="w-8 h-8 text-gray-500" /> {/* ไอคอนนัดหมาย */}
            <span className="text-lg font-semibold text-gray-700">นัดหมายออนไลน์</span>
          </div>
        </Link>

        <Link href="/history">
          <div className="p-4 flex items-center gap-4 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer mt-4">
            <Archive className="w-8 h-8 text-gray-500" /> {/* ไอคอนประวัติ */}
            <span className="text-lg font-semibold text-gray-700">ประวัติการรักษา</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;
