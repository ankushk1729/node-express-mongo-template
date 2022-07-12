require('dotenv').config()
require('express-async-errors')
const express = require('express')
const connectDB = require('./db/connect')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const {auth:AuthMiddleware} = require('./middlewares/authentication')
const ErrorHandlerMiddleware = require('./middlewares/error-handler')
const NotFoundMiddleware = require('./middlewares/not-found')
const AuthRouter = require('./routes/auth.route')
const ContentRouter = require('./routes/contents.route')
const UserRouter = require('./routes/users.route')




const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(xss())
app.use(helmet())


app.use('/api/auth',AuthRouter)
app.use('/api/contents',AuthMiddleware,ContentRouter)
app.use('/api/users',UserRouter)


app.use(NotFoundMiddleware)
app.use(ErrorHandlerMiddleware)


const PORT = process.env.PORT || 5000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT,()=>console.log(`Server running at port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()