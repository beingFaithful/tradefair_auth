'use server'

import User from "@/models/User";
import ResetToken from "@/models/ResetToken";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/email";
import { hashPassword } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDb from "db";

export async function forgotPasswordAction(formData: FormData) {
    await connectDb();
    const email = formData.get("email") as string;

    const user = await User.findOne({ email });
    
    // We shouldn't reveal if the email exists for security reasons,
    // so we always return a success message or redirect, but only send if it exists.
    if (user) {
        // Delete any existing reset tokens for this user
        await ResetToken.deleteMany({ userId: user._id });

        // Generate a new secure token
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        await ResetToken.create({
            userId: user._id,
            token,
            expiresAt
        });

        await sendPasswordResetEmail(email, token);
    }

    redirect("/forgot-password?success=true");
}

export async function resetPasswordAction(formData: FormData) {
    await connectDb();
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    if (!token || !password) {
        redirect("/reset-password?error=missing-fields");
    }

    // Find valid token
    const resetTokenRecord = await ResetToken.findOne({
        token,
        expiresAt: { $gt: new Date() } // Ensure it hasn't expired
    });

    if (!resetTokenRecord) {
        redirect("/reset-password?error=invalid-token");
    }

    // Hash the new password and update the user
    const hashedPassword = await hashPassword(password);
    
    await User.findByIdAndUpdate(resetTokenRecord.userId, {
        password: hashedPassword
    });

    // Delete the used token
    await ResetToken.findByIdAndDelete(resetTokenRecord._id);

    redirect("/login?message=password-reset-success");
}
