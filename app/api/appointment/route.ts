import { NextResponse } from "next/server";
import { prisma } from "@/prisma/lib/prisma";

// ✅ GET: ดึงข้อมูลใบนัดจาก citizenId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const citizenId = searchParams.get("citizenId");

    if (!citizenId) {
      return NextResponse.json({ error: "❌ Missing citizenId" }, { status: 400 });
    }

    // ✅ ค้นหา userId จาก citizenId
    const user = await prisma.user.findUnique({
      where: { citizenId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "❌ User not found" }, { status: 404 });
    }

    // ✅ ค้นหาใบนัดทั้งหมดของ user
    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    });

    // ✅ ปรับวันที่ให้อยู่ในรูปแบบ ISO String เพื่อให้ Client แปลงได้ถูกต้อง
    const adjustedAppointments = appointments.map((appointment) => ({
      ...appointment,
      date: appointment.date.toISOString(),
    }));

    return NextResponse.json(adjustedAppointments, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching appointments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ POST: สร้างใบนัด
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { citizenId, department, date, time } = body;

    if (!citizenId || !department || !date || !time) {
      return NextResponse.json({ error: "❌ Missing required fields" }, { status: 400 });
    }

    // ✅ ค้นหา userId จาก citizenId
    const user = await prisma.user.findUnique({
      where: { citizenId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "❌ User not found" }, { status: 404 });
    }

    // ✅ แปลงวันที่โดยระบุ Time Zone เป็น UTC+7 (Asia/Bangkok)
    const parsedDate = new Date(`${date}T00:00:00+07:00`);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "❌ Invalid date format" }, { status: 400 });
    }

    // ✅ เพิ่มการ log เพื่อตรวจสอบวันที่
    console.log("Parsed Date:", parsedDate.toString());

    // ✅ ตรวจสอบการจองซ้ำ
    const existingAppointment = await prisma.appointment.findFirst({
      where: { userId: user.id, date: parsedDate, time, department },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "❌ You already have an appointment at this time and department" },
        { status: 409 }
      );
    }

    // ✅ บันทึกใบนัด
    const appointment = await prisma.appointment.create({
      data: {
        department,
        date: parsedDate,
        time,
        userId: user.id,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("🚨 Error creating appointment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ DELETE: ลบใบนัด
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const citizenId = searchParams.get("citizenId");

    if (!id || !citizenId) {
      return NextResponse.json({ error: "❌ Missing ID or citizenId" }, { status: 400 });
    }

    // ✅ ค้นหา userId จาก citizenId
    const user = await prisma.user.findUnique({
      where: { citizenId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "❌ User not found" }, { status: 404 });
    }

    // ✅ ตรวจสอบว่าใบนัดมีอยู่หรือไม่
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
    });

    if (!appointment) {
      return NextResponse.json({ error: "❌ Appointment not found" }, { status: 404 });
    }

    // ✅ ตรวจสอบว่าเป็นเจ้าของใบนัด
    if (appointment.userId !== user.id) {
      return NextResponse.json({ error: "❌ Unauthorized" }, { status: 403 });
    }

    // ✅ ลบใบนัด
    await prisma.appointment.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "✅ Appointment canceled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Error deleting appointment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}