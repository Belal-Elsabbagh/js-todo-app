import mongoose from 'mongoose'
const { MONGODB_URI } = process.env;

const connectToDb = () => {
    try {
        if(!MONGODB_URI) throw new Error('MONGODB_URI is not defined')
        mongoose.connect(MONGODB_URI)
        return mongoose.connection
    } catch (err) {
        throw err
    }
}

export default connectToDb()