import { auth } from "../../auth";
import { verifyJWT } from "@/lib/auth";

/**
 * Resolves the authenticated user's email from either NextAuth session
 * or a Bearer JWT token. Returns null if unauthenticated.
 */
export async function resolveUserEmail(req: Request): Promise<string | null> {
    // 1. Try NextAuth session
    const session = await auth();
    if (session?.user?.email) {
        return session.user.email;
    }

    // 2. Try Bearer Token
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = await verifyJWT(token);
        if (decoded?.email) {
            return decoded.email;
        }
    }

    return null;
}
