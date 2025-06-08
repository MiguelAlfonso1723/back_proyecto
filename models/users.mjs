import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema({

    mail: {
        type: String,
        required: [true, 'mail required'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['administrador', 'camarero'],
        default: 'camarero',
        required: true
    }

})

export default mongoose.model('User', UserSchema)