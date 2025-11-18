const authRouter = require('./authRoute')
const userRouter = require('./userRoute')
const blogRouter = require('./blogRoute')
const careerTestRouter = require('./careerTestRoutes')
const studentRouter = require('./studentRoute')    
const commentRouter = require('./commentRoute');
const likeRouter = require('./likeRoute');
const careerPathRouter = require('./careerPathRoute');
const lessonRouter = require('./lessonRoute');
const testRouter = require('./testRoute');
const companyRouter = require('./companyRoute'); 
const followRouter = require('./followRoute'); 

function route(app) {
    app.use("/auth",authRouter)
    app.use("/users",userRouter)
    app.use("/blogs",blogRouter)
    app.use("/career-test", careerTestRouter)
    app.use("/students", studentRouter)
    app.use("/comments", commentRouter)
    app.use("/likes", likeRouter);
    app.use("/students", studentRouter)  
    app.use("/career-paths", careerPathRouter); 
    app.use("/lessons", lessonRouter);
    app.use("/tests", testRouter);
    app.use("/companies", companyRouter); 
    app.use("/follows", followRouter); 
}

module.exports = route;