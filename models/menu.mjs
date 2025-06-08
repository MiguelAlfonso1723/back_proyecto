import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const MenuSchema = new Schema({
    name_product: {
        type: String,
        required: [true, 'name_product required'],
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    capasity: {
        type: Number,
        required: true
    },
    is_available: {
        type: Boolean,
        default: true
    }
})

export default mongoose.model('menu', MenuSchema)