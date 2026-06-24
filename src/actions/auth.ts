'use server'
import User from "@/models/User"
import SpecialID from "@/models/SpecialID"
import connectDb from "db"
import { signIn, signOut } from "../../auth"
import { hashPassword } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"
import { COLLEGE_DEPARTMENTS } from "@/lib/college-data"

const signUpSchema = z.object({
    identifier: z.string().min(1, "Identifier is required").max(200),
    password: z.string().min(8, "Password must be at least 8 characters"),
    type: z.enum(['student_email', 'special_id']),
    firstName: z.string().min(1).max(100).trim(),
    lastName: z.string().min(1).max(100).trim(),
    gender: z.enum(['male', 'female', 'other']),
    level: z.enum(['100', '200', '300', '400', '500']).nullish(),
    department: z.string().max(100).trim().nullish(),
    college: z.enum(['CBAS', 'CHMS', 'CAHS']).nullish(),
})

export async function signUpAction(formData: FormData) {
    // Validate input with Zod
    const parsed = signUpSchema.safeParse({
        identifier: formData.get("identifier"),
        password: formData.get("password"),
        type: formData.get("type"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        gender: formData.get("gender"),
        level: formData.get("level"),
        department: formData.get("department"),
        college: formData.get("college"),
    })

    if (!parsed.success) {
        redirect('/signup?error=missing-fields')
    }

    const { identifier, password, type, firstName, lastName, gender, level, department, college } = parsed.data

    // Validate department belongs to selected college
    if (type === 'student_email' && department && college) {
        const validDepts = COLLEGE_DEPARTMENTS[college] || [];
        if (!validDepts.some(d => d.toLowerCase() === department.toLowerCase())) {
            redirect(`/signup?error=invalid-department`)
        }
    }

    await connectDb();

    let finalEmail = identifier;

    if (type === 'student_email') {
        const expectedEmail = `${firstName.toLowerCase()}${lastName.toLowerCase()}@mtu.edu.ng`;
        if (identifier.toLowerCase() !== expectedEmail) {
            redirect(`/signup?error=invalid-email`)
        }
        if (!level) redirect('/signup?error=missing-fields');
        if (!college) redirect('/signup?error=missing-fields');
    } else if (type === 'special_id') {
        // Check if Special ID exists and is unclaimed
        const specialIDDoc = await SpecialID.findOne({ code: identifier, isClaimed: false });
        if (!specialIDDoc) {
            redirect('/signup?error=invalid-special-id')
        }
        // For special IDs, we use the ID as the "email" for login purposes
        finalEmail = identifier;
    } else {
        redirect('/signup?error=missing-fields')
    }

    const existingUser = await User.findOne({ email: finalEmail })
    if (existingUser){
        redirect('/signup?error=email-exists')
    }

    const hashedPassword = await hashPassword(password)
    const newUser = await User.create({
        email: finalEmail,
        identifierType: type,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        ...(level ? { level } : {}),
        ...(department ? { department } : {}),
        ...(college ? { college } : {}),
    })

    // If it was a special ID, mark it as claimed
    if (type === 'special_id') {
        await SpecialID.findOneAndUpdate(
            { code: identifier },
            { isClaimed: true, claimedBy: newUser._id }
        );
    }
    
    // Automatically sign in after signup
    try {
        await signIn("credentials", {
            email: finalEmail,
            password,
            redirect: false,
        })
    } catch {
        // Ignore — user was created, redirect to login as fallback
        redirect("/login")
    }
    redirect("/buyer")
}

export const loginAction = async (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
        await connectDb()
        const user = await User.findOne({ email })

        let redirectTo = "/buyer"
        if (user && user.role && user.role.includes('admin')) {
            redirectTo = "/admin"
        }

        await signIn("credentials", {
            email,
            password,
            redirectTo
        })
    } catch (error: any) {
        if (error?.type === 'CredentialsSignin' || error?.message?.includes('CredentialsSignin')) {
            return redirect('/login?error=invalid-credentials')
        }
        // NEXT_REDIRECT means successful login — must propagate
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        // Everything else: DB connection failures, network errors, etc.
        console.error("Login error:", error)
        return redirect('/login?error=server-error')
    }
}


export const logoutAction = async () => {
    try {
        await signOut({ redirect: false })
    } catch (e) {
        // signOut may throw if session is already invalid; ignore
    }
    redirect("/login")
}

export const googleSignInAction = async () => {
    await signIn("google", { redirectTo: "/buyer" })
}
