import mongoose from "mongoose";
const TradeSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    farmerName: {
        type: String,
        required: true,
    },
    offering: {
        type: String,
        required: true,
    },
    needs: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Trade = mongoose.model("Trade", TradeSchema);
export default Trade;

