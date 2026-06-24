import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: false, // Optional, chat can be general or tied to a product
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const ChatRoom = mongoose.models.ChatRoom || mongoose.model("ChatRoom", ChatRoomSchema);

export default ChatRoom;
