import mongoose from "mongoose";
import { Schema } from "mongoose";

const OrderSchema = new Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'menu',
        required: true
    }],
    quantity: {
        type: Number,
        required: true
    },
    order_type: {
        type: String,
        enum: ['llevar', 'domicilio', 'local'],
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    is_cancelled: {
        type: Boolean,
        required: true,
        default: false
    },
    register_hour: {
        type: String,
        required: true,
    },
})