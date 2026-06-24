import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'completed', 'cancelled'],
        default: 'pending',
    },
    paystackReference: {
        type: String,
        required: false, // Will be filled when payment is initialized
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

OrderSchema.pre('save', async function() {
    this.updatedAt = new Date();
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
