import mongoose from "mongoose";
import { Schema } from "mongoose";

const OrderSchema = new Schema({
    products: [{
        menu: {
            type: Schema.Types.ObjectId,
            ref: 'Menu',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
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
    date: {
        type: Date,
        required: true,
    },
})

export default mongoose.model('Order', OrderSchema);