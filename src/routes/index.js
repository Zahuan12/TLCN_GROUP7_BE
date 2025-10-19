const authRouter = require('./authRoute')
const userRouter = require('./userRoute')
const blogRouter = require('./blogRoute')
function route(app) {
    app.use("/auth",authRouter)
    app.use("/users",userRouter)
    app.use("/blogs",blogRouter)
}

module.exports = route;