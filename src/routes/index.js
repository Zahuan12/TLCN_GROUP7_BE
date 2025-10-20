const authRouter = require('./authRoute')
const userRouter = require('./userRoute')
const blogRouter = require('./blogRoute')
const careerTestRouter = require('./careerTestRoutes')
function route(app) {
    app.use("/auth",authRouter)
    app.use("/users",userRouter)
    app.use("/blogs",blogRouter)
    app.use("/career-test", careerTestRouter)
}

module.exports = route;