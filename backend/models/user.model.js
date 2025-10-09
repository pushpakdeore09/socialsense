import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            lowercase: true
        },
        lastName: {
            type: String,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)
export default User;