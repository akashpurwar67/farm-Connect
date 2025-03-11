import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: ['kg', 'pcs', 'pack'],  // Unit can be kg, pcs, or pack
      required: true,  // Unit is required
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
        type:String,
        required:true,
    },
    image: {
        type:String,
    },
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true, 
    },
    quantity: {
        type:Number,
        required:true,
    },
  },
  { timestamps: true }
);

const item = mongoose.model('item', itemSchema);

export default item;
