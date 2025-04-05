import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// ✅ สร้าง pool เชื่อมต่อ MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // ใส่รหัสผ่าน XAMPP ถ้ามี
  database: "hospital_booking",
  waitForConnections: true,
  connectionLimit: 10,
});

// ✅ GET /api/departments
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT id, name FROM departments");
    connection.release();

    return NextResponse.json(rows); // ✅ ส่งกลับเป็น array
  } catch (error) {
    console.error("❌ Error loading departments:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลแผนกได้" },
      { status: 500 }
    );
  }
}
