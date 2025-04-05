import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// ✅ ตั้งค่าการเชื่อมต่อ MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "hospital_booking",
  waitForConnections: true,
  connectionLimit: 10,
});

// ✅ GET: ดึงข้อมูลผู้ใช้ด้วย citizenId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const citizenId = searchParams.get("citizenId");

    if (!citizenId) {
      return NextResponse.json(
        { error: "❌ กรุณาระบุ citizenId" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    // 🔍 Query พร้อมคำนำหน้า
    const [rows] = await connection.execute(
      "SELECT citizenId, prefix, name, phone, birthday FROM user WHERE citizenId = ?",
      [citizenId]
    );

    connection.release();

    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "❌ ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    const user = users[0];

    return NextResponse.json({
      citizenId: user.citizenId,
      prefix: user.prefix ?? "", // ✅ ป้องกันกรณีไม่มี prefix
      name: user.name,
      phone: user.phone,
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split("T")[0]
        : null,
    });
  } catch (error) {
    console.error("🚨 Error fetching user:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" },
      { status: 500 }
    );
  }
}
