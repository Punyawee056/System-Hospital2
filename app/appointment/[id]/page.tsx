"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ ใช้ useParams แทน useRouter
import AppointmentCard from "../../components/AppointmentCard"; 

export default function AppointmentDetailPage() {
  const { id } = useParams(); // ✅ ดึงค่า id จาก URL
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    if (!id) return; // ✅ ป้องกัน fetch ถ้าไม่มี id

    console.log("Fetching appointment ID:", id);
    fetch(`/api/appointment?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched appointment data:", data);
        setAppointment(data);
      })
      .catch((err) => console.error("Error fetching appointment:", err));
  }, [id]);

  if (!appointment) return <p>กำลังโหลด...</p>;

  return (
    <AppointmentCard
      idCard={appointment.id}
      department={appointment.department}
      date={appointment.date}
      time={appointment.time}
    />
  );
}
