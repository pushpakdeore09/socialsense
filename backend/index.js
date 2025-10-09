import express from 'express'
import dotenv from 'dotenv'
import {dbConnect} from './db/db.js'

dotenv.config()

const app = express()
dbConnect()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server Up")
});

app.listen(PORT, () => {
    console.log(`Server up on PORT: ${PORT}`);
    
})