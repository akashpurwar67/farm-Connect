import mongoose from "mongoose";

const rentItemSchema = new mongoose.Schema(
    {
        itemname: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, default: 0 }, // Default to 0 to avoid undefined issues
        city: { type: String, required: true },
        state: { type: String, required: true },
        price: { type: Number, required: true }, // Price per day
        description: { type: String, required: true },
        sellerid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        latitude: { type: Number },
        longitude: { type: Number },
    },
    { timestamps: true }
);

const RentItem = mongoose.model("RentItem", rentItemSchema);
export default RentItem;
