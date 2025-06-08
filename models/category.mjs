import mongoose from "mongoose";
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name_category: {
        type: String,
        required: [true, 'name_category required'],
        unique: true
    },
    description: {
        type: String,
        required: true
    }
})

export default mongoose.model('category', CategorySchema);