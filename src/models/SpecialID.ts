import mongoose from "mongoose";

const SpecialIDSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    isClaimed: {
        type: Boolean,
        default: false,
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const SpecialID = mongoose.models.SpecialID || mongoose.model("SpecialID", SpecialIDSchema);

export default SpecialID;
