import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "db";
import { resolveUserEmail } from "@/lib/api-auth";

export async function GET(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isAuthorizedSeller: user.isAuthorizedSeller,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                level: user.level,
                department: user.department,
                college: user.college,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
