import mongoose from 'mongoose';

const URL = process.env.URL

try {
    await mongoose.connect(URL)
    console.log('MongoDB Connect Success...')
} catch (err) {
    console.log(err)
}

export default mongoose