import mongoose from 'mongoose'

export function dbConnect(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(error => {
        console.log(error);
        
    })
}