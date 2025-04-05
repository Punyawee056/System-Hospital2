import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(req: Request) {
  try {
    const { department, date } = await req.json()

    if (!department || !date) {
      return NextResponse.json({ error: "Missing department or date" }, { status: 400 })
    }

    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "", // ใส่รหัสผ่าน XAMPP ถ้ามี
        database: "hospital_booking",
    
    })

    const [deptRows] = await connection.execute(
      "SELECT id FROM departments WHERE name = ?",
      [department]
    )

    if ((deptRows as any[]).length === 0) {
      return NextResponse.json({ error: "ไม่พบแผนกนี้" }, { status: 404 })
    }

    const departmentId = (deptRows as any[])[0].id

    const [slotRows] = await connection.execute(
      `SELECT id, start_time, end_time, available_seats 
       FROM appointment_slots 
       WHERE department_id = ? AND slot_date = ? AND available_seats > 0`,
      [departmentId, date]
    )

    await connection.end()
    return NextResponse.json(slotRows)
  } catch (error) {
    console.error("❌ ERROR in available-times API:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 })
  }
}
