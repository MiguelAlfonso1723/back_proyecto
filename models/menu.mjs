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
        ref: 'Category',
        required: true
    },
    capasity: {
        type: Number,
        required: true
    },
    is_available: {
        type: Boolean,
        default: true,
        required: true
    },
    url_image: {
        type: String,
        required: [true, 'url_image required']
    },
})

export default mongoose.model('Menu', MenuSchema)