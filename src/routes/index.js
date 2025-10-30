const authRouter = require('./authRoute')
const userRouter = require('./userRoute')
const blogRouter = require('./blogRoute')
const careerTestRouter = require('./careerTestRoutes')
const studentRouter = require('./studentRoute')    
function route(app) {
    app.use("/auth",authRouter)
    app.use("/users",userRouter)
    app.use("/blogs",blogRouter)
    app.use("/career-test", careerTestRouter)
    app.use("/students", studentRouter)
}

module.exports = route;