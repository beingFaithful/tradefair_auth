import connectDb from "./db";
import User from "./src/models/User";

async function listUsers() {
    process.env.MONGODB_URI = "mongodb://localhost:27017/tradefair-auth";
    await connectDb();
    const users = await User.find({});
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}

listUsers();
