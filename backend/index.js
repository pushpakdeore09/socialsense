import express from 'express'
import dotenv from 'dotenv'
import {dbConnect} from './db/db.js'
import userRoutes from './routes/user.routes.js'

dotenv.config()

const app = express()
app.use(express.json())
dbConnect()
const PORT = process.env.PORT || 5000

app.use("/api/auth", userRoutes)

app.get('/', (req, res) => {
    res.send("Server Up")
});

app.listen(PORT, () => {
    console.log(`Server up on PORT: ${PORT}`);
})