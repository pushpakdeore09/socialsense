import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {dbConnect} from './db/db.js'
import userRoutes from './routes/user.routes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
dbConnect()
const PORT = process.env.PORT || 5000

app.use("/api/auth", userRoutes)

app.get('/', (req, res) => {
    res.send("Server Up")
});

app.listen(PORT, () => {
    console.log(`Server up on PORT: ${PORT}`);
})