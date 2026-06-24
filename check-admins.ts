import connectDb from "./db.ts";
import User from "./src/models/User.ts";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function findAdmin() {
    try {
        await connectDb();
        const admins = await User.find({ role: 'admin' });
        console.log("Admins found:", admins.map(a => ({ email: a.email, role: a.role })));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

findAdmin();
