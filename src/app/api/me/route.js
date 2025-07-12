import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req) {
  try {
    // const token = req.cookies.get("token")?.value;
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // if (!token) {
    //   return NextResponse.json({ error: "No token" }, { status: 401 });
    // }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("print");

    if (!decoded?.userId) {
      console.log(decoded);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { learner_type: true },
    });
    console.log("print");
    console.log(user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ learner_type: user.learner_type });
  } catch (err) {
    console.error("Auth error:", err);
    console.error("Auth error:", err.name, err.message);
    // return NextResponse.json({ error: "Internal error" }, { status: 500 });
    return NextResponse.json({ error: err.message }, { status: 401 }); // Send error back for debugging
  }
}
