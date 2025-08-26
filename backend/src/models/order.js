const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty:   { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items:    { type: [OrderItemSchema], required: true },
    shipping: {
      fullName: { type: String, required: true },
      phone:    { type: String, required: true },
      address:  { type: String, required: true },
      city:     { type: String, required: true },
      zip:      { type: String, required: true }
    },
    totals: {
      subtotal: { type: Number, required: true, min: 0 },
      shipping: { type: Number, required: true, min: 0 },
      total:    { type: Number, required: true, min: 0 }
    },
    status: { type: String, enum: ['new','processing','shipped','delivered','cancelled'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
