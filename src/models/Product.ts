import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'hidden'],
        default: 'available',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

ProductSchema.pre('save', async function() {
    this.updatedAt = new Date();
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
