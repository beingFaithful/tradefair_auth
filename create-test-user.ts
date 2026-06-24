import connectDb from "./db";
import User from "./src/models/User";
import { hashPassword } from "./src/lib/auth";
import mongoose from "mongoose";

async function createTestUser() {
    try {
        await connectDb();
        const email = "test@mtu.edu.ng";
        const password = "password123";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Test user already exists");
            process.exit(0);
        }

        const hashedPassword = await hashPassword(password);
        await User.create({
            email,
            password: hashedPassword,
            role: ['buyer', 'seller'],
            isAuthorizedSeller: true // Make them a seller too
        });

        console.log("Test user created: test@mtu.edu.ng / password123");
        process.exit(0);
    } catch (error) {
        console.error("Error creating test user:", error);
        process.exit(1);
    }
}

createTestUser();
