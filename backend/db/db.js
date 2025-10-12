import mongoose from 'mongoose';

export async function dbConnect() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Connected to Database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message || error);
    }
}
