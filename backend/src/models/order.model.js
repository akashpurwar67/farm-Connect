import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    itemid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    itemname: {
        type: String,
        required: true,
    }, 
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
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
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
  },
  { timestamps: true }
);

const order = mongoose.model('order', orderSchema);

export default order;
