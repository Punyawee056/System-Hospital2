import { NextResponse } from "next/server";
import { prisma } from "@/prisma/lib/prisma";

// 🔧 helper function
async function getUserByCitizenId(citizenId: string) {
  return await prisma.user.findUnique({
    where: { citizenId },
    select: { id: true },
  });
}

// ✅ GET: ดึงข้อมูลใบนัดจาก citizenId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const citizenId = searchParams.get("citizenId")

    if (!citizenId) {
      return NextResponse.json({ error: "❌ Missing citizenId" }, { status: 400 })
    }

    // ค้นหา user จาก citizenId
    const user = await prisma.user.findUnique({
      where: { citizenId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "❌ User not found" }, { status: 404 })
    }

    // ดึงใบนัดทั้งหมดของ user (เรียงจากวันล่าสุดขึ้นก่อน)
    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    })

    // ปรับรูปแบบวันให้เป็น string
    const formatted = appointments.map((a) => ({
      id: a.id,
      department: a.department,
      date: a.date.toISOString(),
      time: a.time,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("🚨 GET /api/appointment error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
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

    const user = await getUserByCitizenId(citizenId);
    if (!user) {
      return NextResponse.json({ error: "❌ User not found" }, { status: 404 });
    }

    const parsedDate = new Date(`${date}T00:00:00+07:00`);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "❌ Invalid date format" }, { status: 400 });
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        userId: user.id,
        date: parsedDate,
        time,
        department,
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "❌ เวลานี้คุณได้แจ้งแล้ว" },
        { status: 409 }
      );
    }

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
    const idParam = searchParams.get("id");
    const citizenId = searchParams.get("citizenId");

    if (!idParam || !citizenId) {
      return NextResponse.json({ error: "❌ Missing ID or citizenId" }, { status: 400 });
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "❌ Invalid appointment ID" }, { status: 400 });
    }

    const user = await getUserByCitizenId(citizenId);
    if (!user) {
      return NextResponse.json({ error: "❌ User not found" }, { status: 404 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: "❌ Appointment not found" }, { status: 404 });
    }

    if (appointment.userId !== user.id) {
      return NextResponse.json({ error: "❌ Unauthorized" }, { status: 403 });
    }

    await prisma.appointment.delete({
      where: { id },
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
