import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    identifierType: {
        type: String,
        enum: ['student_email', 'special_id'],
        required: true,
        default: 'student_email'
    },
    password: {
        type: String,
        required: false,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false,
    },
    level: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: false,
    },
    college: {
        type: String,
        required: false,
    },
    role: {
        type: [String],
        default: ['buyer'],
        enum: ['buyer', 'seller', 'admin']
    },
    sellerName: {
        type: String,
        required: false,
        trim: true,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
        maxlength: 500,
    },
    sellerStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Virtual: true if user is an approved seller with the 'seller' role
UserSchema.virtual('isAuthorizedSeller').get(function() {
    return this.sellerStatus === 'approved' && this.role.includes('seller');
});

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User;
