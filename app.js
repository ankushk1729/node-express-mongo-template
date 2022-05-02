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
const AuthRouter = require('./routes/auth')
const PostRouter = require('./routes/posts')
const UserRouter = require('./routes/users')
const CommentRouter = require('./routes/comments')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const upload = require('./controllers/upload')


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(xss())
app.use(helmet())
app.use(fileUpload({useTempFiles:true}))

app.use('/api/auth',AuthRouter)
app.use('/api/posts',AuthMiddleware,PostRouter)
app.use('/api/users',UserRouter)
app.use('/api/comments',AuthMiddleware,CommentRouter)
app.post('/api/upload',AuthMiddleware,upload)

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