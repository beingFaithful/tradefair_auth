import connectDb from "./db";
import User from "./src/models/User";

async function findAdmin() {
    await connectDb();
    const admins = await User.find({ role: 'admin' });
    console.log("Admins found:", admins.map(a => ({ email: a.email, role: a.role })));
    process.exit(0);
}

findAdmin();
