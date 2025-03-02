//หน้าใบนัด

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppointmentCard from "../components/AppointmentCard"; 


export default function AppointmentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/appointments?id=${id}`)
        .then((res) => res.json())
        .then((data) => setAppointment(data));
    }
  }, [id]);

  if (!appointment) return <p>กำลังโหลด...</p>;

  return (
    <AppointmentCard
      idCard={appointment.idCard}
      department={appointment.department}
      date={appointment.date}
      time={appointment.time}
    />
  );
}
