import mongoose from "mongoose";

const ResetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Create a TTL index so the document automatically deletes after expiration
ResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ResetToken = mongoose.models.ResetToken || mongoose.model("ResetToken", ResetTokenSchema);

export default ResetToken;
