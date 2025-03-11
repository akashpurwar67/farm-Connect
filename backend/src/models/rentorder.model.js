import mongoose from "mongoose";

const rentOrderSchema = new mongoose.Schema(
    {
        itemid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "RentItem",
        },
        itemname: {
            type: String,
            required: true,
        },
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        sellerid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dueDate: {
            type: Date,
            required: true, // Ensuring due date is always set
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled", "completed","returned"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const RentOrder = mongoose.model("RentOrder", rentOrderSchema);

export default RentOrder;
