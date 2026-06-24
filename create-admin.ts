import connectDb from "./db";
import User from "./src/models/User";
import { hashPassword } from "./src/lib/auth";
import mongoose from "mongoose";

async function createAdmin() {
    process.env.MONGODB_URI ||= "mongodb://localhost:27017/tradefair-auth";
    try {
        await connectDb();
        const email = "admin@mtu.edu.ng";
        const password = "AdminPass123!";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Updating existing user to admin:", email);
            await User.updateOne({ email }, { $set: { role: ['admin'] } });
        } else {
            const hashedPassword = await hashPassword(password);
            await User.create({
                email,
                password: hashedPassword,
                role: ['admin'],
                firstName: "System",
                lastName: "Admin",
                identifierType: 'student_email'
            });
            console.log("Admin user created: admin@mtu.edu.ng / AdminPass123!");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

createAdmin();
