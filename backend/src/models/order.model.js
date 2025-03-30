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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        ref: 'User',
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Online Payment'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Cancelled', 'Shipped', 'Delivered'],
        default: 'Pending',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
